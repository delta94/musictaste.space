import React from 'react'
import { Button } from 'reactstrap'

const Genres = ({
  history,
  matchData,
}: {
  history: any
  matchData: IMatchData
}) => {
  const genres = matchData.matchedGenres.filter((v) => v.rank > 0)
  const handleReturn = (e: any) => {
    history.push('/compatibility#matches')
  }
  const maxCount = genres.length ? genres[0].rank : 0
  return (
    <div className="genres">
      <div className="genres-header">Genres</div>
      <div className="genres-container">
        <div className="genres-text">
          {genres.length
            ? 'These are the genres you had most in common:'
            : 'You had no genres in common.'}
        </div>
        {genres.map((genre) => {
          return (
            <div className="genre-container" key={genre.genre}>
              <div
                className="bar"
                style={{
                  width: `${80 + ((genre.rank as number) / maxCount) * 200}px`,
                }}
              />
              <div className="genre-title genre-text">{genre.genre}</div>
            </div>
          )
        })}
      </div>
      <Button
        className="btn-round sign-in-button return-button"
        size="lg"
        onClick={handleReturn}
      >
        Return to Compatibility
      </Button>
    </div>
  )
}

export default Genres
