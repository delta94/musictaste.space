import React from 'react'
import { Button } from 'reactstrap'
import { useHistory } from 'react-router'

const Genres = ({ genreData }: { genreData: IGenreDict }) => {
  const genres = Object.entries(genreData)
    .map(val => [val[1].count, val[0]])
    .filter(v => v[0] > 5)
    .sort((a, b) => (b[0] as number) - (a[0] as number))
  const history = useHistory()
  const handleReturn = (e: any) => {
    history.push('/dashboard')
  }
  const maxCount: number = Number.parseInt(genres[0][0] as string, 10)
  return (
    <div className="genres">
      <div className="genres-header">Genres</div>
      <div className="genres-container">
        <div className="genres-text">
          These are your top genres based off the artists you like:
        </div>
        {genres.map(genre => {
          return (
            <div className="genre-container" key={genre[1]}>
              <div
                className="bar"
                style={{
                  width: `${80 + ((genre[0] as number) / maxCount) * 200}px`,
                }}
              />
              <div className="genre-text genre-title">{genre[1]}</div>
            </div>
          )
        })}
        <Button
          className="btn-round sign-in-button return-button"
          size="lg"
          onClick={handleReturn}
        >
          Return to Dashboard
        </Button>
      </div>
    </div>
  )
}

export default Genres
