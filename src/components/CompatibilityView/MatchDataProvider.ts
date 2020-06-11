import { firestore } from 'firebase/app'
import cloneDeep from 'lodash/cloneDeep'
import debounce from 'lodash/debounce'
import throttle from 'lodash/throttle'
import uniq from 'lodash/uniq'
import firebase from '../../util/Firebase'
import {
  getArrayWithNestedJSON,
  removeFromObject,
} from '../../util/fromObjectInLocalStorage'

const _log = (...rest: Array<string | number | object>) => {
  console.log(`[PREVIEW 🔎]:`, ...rest)
}
class MatchDataProvider {
  public matches: Array<[string, IPreviewMatchData]>
  public latestMatch: IPreviewMatchData | null
  public loading: boolean
  public lastPage: number
  public morePages: boolean
  private lastDoc: firestore.DocumentSnapshot | null
  private currentUser: string
  private requestLength: number

  constructor(latest: IPreviewMatchData | null, currentUser: string) {
    this.matches = []
    this.loading = false
    this.lastPage = 0
    this.latestMatch = null
    this.lastDoc = null
    this.morePages = false
    this.requestLength = 0
    this.currentUser = currentUser
    if (latest) {
      this.latestMatch = latest
    }
  }

  public async initialise(count: number) {
    const matches = getArrayWithNestedJSON('matchPreviews') as Array<
      [string, IPreviewMatchData]
    >
    if (!matches.length) {
      this.matches = []
    } else {
      this.matches = matches.map(([i, m]) => {
        m.matchDate = firestore.Timestamp.fromDate(
          new Date((m.matchDate as unknown) as string)
        )
        return [i, m]
      })
      this.matches = uniq(this.matches)
      this.sortMatches()
    }
    if (this.latestMatch && this.matches.length) {
      const latestStoredMatch = this.matches[0][1]
      if (
        this.latestMatch.matchDate.toMillis() >
        latestStoredMatch.matchDate.toMillis()
      ) {
        _log(
          'new match detected.',
          '\nCache exists until:',
          latestStoredMatch.matchDate.toDate().toTimeString(),
          '\nDatabse reports match:',
          this.latestMatch.matchDate.toDate().toTimeString()
        )
        await this.loadMatches(latestStoredMatch.matchDate.toDate(), count, '>')
      }
      if (this.matches.length < count) {
        _log('need additional matches.')
        await this.loadMatches(new Date(2020, 1, 1), count, '>')
      }
    } else if (this.latestMatch && !this.matches.length) {
      _log('loading matches for empty storage.')
      await this.loadMatches(new Date(2020, 1, 1), count, '>')
    }
    this.requestLength = Math.min(200, this.requestLength + count)
    _log(this.matches.length, 'matches loaded from storage.')
    if (this.matches.length >= count) {
      this.morePages = true
    }
    return this.matches.slice(0, this.requestLength)
  }

  public deleteMatch(id: string) {
    const ids = this.matches.map((d) => d[0])
    const index = ids.indexOf(id)
    if (index !== -1) {
      if (index === 0) {
        this.matches.shift()
      } else if (index === this.matches.length - 1) {
        this.matches.pop()
      } else {
        this.matches.splice(index, 1)
      }
      throttle(() => this.writeMatchesToStorage(), 500)()
      this.requestLength = Math.min(this.matches.length, this.requestLength)
    }
    return this.matches.slice(0, this.requestLength)
  }

  public async moreMatches(limit: number) {
    if (this.matches.length === 200) {
      this.morePages = false
      return this.matches.slice(0, this.requestLength)
    }
    _log('requesting', limit, 'more matches.')
    this.requestLength = Math.min(200, this.requestLength + limit)
    if (!this.matches.length) {
      await this.loadMatches(new Date(2020, 1, 1), limit, '>')
    }
    if (this.matches.length < this.requestLength) {
      const lastMatch = this.matches[this.matches.length - 1][1]
      await this.loadMatches(lastMatch.matchDate.toDate(), limit, '<')
    }
    return this.matches.slice(0, this.requestLength)
  }

  private sortMatches() {
    this.matches.sort(
      (a: [string, IPreviewMatchData], b: [string, IPreviewMatchData]) =>
        b[1].matchDate.toMillis() - a[1].matchDate.toMillis()
    )
  }

  private async loadMatches(startDate: Date, LIMIT = 5, operator: '>' | '<') {
    _log('calling database for', LIMIT, 'additional matches.')
    let matchRef
    if (!this.lastDoc) {
      matchRef = firebase.app
        .firestore()
        .collection('users')
        .doc(this.currentUser || '')
        .collection('matches')
        .where('matchDate', operator, startDate)
        .orderBy('matchDate', 'desc')
        .limit(LIMIT)
    } else {
      matchRef = firebase.app
        .firestore()
        .collection('users')
        .doc(this.currentUser || '')
        .collection('matches')
        .where('matchDate', operator, startDate)
        .orderBy('matchDate', 'desc')
        .limit(LIMIT)
        .startAfter(this.lastDoc)
    }
    const docs = await matchRef.get()
    _log('received', docs.docs.length, 'new results.')
    const matchData: Array<[string, IPreviewMatchData]> = docs.docs.map((d) => [
      d.id,
      d.data() as IPreviewMatchData,
    ])
    if (matchData.length) {
      this.lastDoc = docs.docs[docs.docs.length - 1]
      if (
        matchData.length === LIMIT &&
        this.lastDoc.data()?.matchDate.toDate() > startDate
      ) {
        _log('empty storage or previews in storage too old, clearing.')
        localStorage.removeItem('matchPreviews')
        this.matches = matchData
      } else {
        this.removeDuplicates(matchData)
        matchData.map((m) => removeFromObject('matches')(m[1].matchId))
        this.matches = this.matches.concat(matchData)
      }
      this.sortMatches()
      debounce(() => this.writeMatchesToStorage(), 500)()
    }
    this.morePages = docs.docs.length < LIMIT ? false : true
  }

  private writeMatchesToStorage() {
    // only store at most 200 matches to storage
    const cd = cloneDeep(this.matches).slice(0, 200)

    cd.forEach((m) => {
      m[1].matchDate = (m[1].matchDate
        .toDate()
        .toISOString() as unknown) as FirebaseFirestore.Timestamp
    })

    _log('wrote', cd?.length, 'matches to storage.')
    const arrOfStr = cd.map((m) => JSON.stringify(m))
    const arrStr = JSON.stringify(arrOfStr)
    localStorage.setItem('matchPreviews', arrStr)
  }

  private removeDuplicates(matchesA: Array<[string, IPreviewMatchData]>) {
    const ids = this.matches.map((t) => t[0])
    for (const [i] of matchesA) {
      const index = ids.indexOf(i)
      if (index !== -1) {
        _log('rematch detected. removing duplicate.')
        this.matches.splice(index, 1)
      }
    }
  }
}

export default MatchDataProvider
