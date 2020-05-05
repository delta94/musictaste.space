import React from 'react'
import { useHistory } from 'react-router'
import { Link } from 'react-router-dom'
const Genres = ({ genreData }: { genreData: IGenreDict }) => {
  const genres = Object.entries(genreData)
    .map((val) => [val[1].count, val[0]])
    .filter((v) => v[0] > 5)
    .sort((a, b) => (b[0] as number) - (a[0] as number))
  const history = useHistory()
  const handleReturn = (e: any) => {
    history.push('/dashboard')
  }
  const maxCount: number = Number.parseInt(genres[0][0] as string, 10)
  return (
    <div className="genres" id="genres">
      <div className="genres-header">Genres</div>
      <div className="genres-container">
        <div className="genres-text">
          These are your top genres based off the artists you like:
        </div>
        <div className="genre-columns">
          <div className="genre-bar-container">
            {genres.slice(0, genres.length / 2).map((genre) => {
              return (
                <div className="genre-container" key={genre[1]}>
                  <div
                    className="bar"
                    style={{
                      width: `${
                        80 + ((genre[0] as number) / maxCount) * 200
                      }px`,
                    }}
                  />
                  <div className="genre-text genre-title">{genre[1]}</div>
                </div>
              )
            })}
          </div>
          <div className="genre-bar-container">
            {genres.slice(genres.length / 2).map((genre) => {
              return (
                <div className="genre-container" key={genre[1]}>
                  <div
                    className="bar"
                    style={{
                      width: `${
                        80 + ((genre[0] as number) / maxCount) * 200
                      }px`,
                    }}
                  />
                  <div className="genre-text genre-title">{genre[1]}</div>
                </div>
              )
            })}
          </div>
        </div>
        <div className="row mb-5 mt-5">
          <div className="col d-flex flex-row justify-content-end full-button">
            <Link to="/dashboard">← Back To Dashboard</Link>
            <Link to="/insights/all">See All Top Tracks & Artists →</Link>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Genres
