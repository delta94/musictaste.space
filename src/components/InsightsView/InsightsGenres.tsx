import { motion } from 'framer-motion'
import React from 'react'
import { Link } from 'react-router-dom'
import { translateInX } from '../../constants/animationVariants'

const Genres = ({ genreData }: { genreData: IGenreDict }) => {
  let genres = Object.entries(genreData)
    .map((val) => [val[1].count, val[0]])
    .filter((v) => v[0] > 5)
    .sort((a, b) => (b[0] as number) - (a[0] as number))

  if (!genres.length) {
    genres = Object.entries(genreData)
      .map((val) => [val[1].count, val[0]])
      .filter((v) => v[0] > 3)
      .sort((a, b) => (b[0] as number) - (a[0] as number))
  }
  const maxCount: number = genres.length
    ? Number.parseInt(genres[0][0] as string, 10)
    : 0
  return (
    <div className="genres" id="genres">
      <div className="genres-header">Genres</div>
      <div className="genres-container">
        <div className="genres-text">
          These are your top genres based off the artists you like:
        </div>
        <div className="genre-columns">
          <div className="genre-bar-container">
            {genres.slice(0, genres.length / 2).map((genre, index) => {
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
                  <motion.div
                    className="genre-text genre-title"
                    initial="initial"
                    animate="translate"
                    variants={translateInX(10, index / 2)}
                  >
                    {genre[1]}
                  </motion.div>
                </div>
              )
            })}
          </div>
          <div className="genre-bar-container">
            {genres.slice(genres.length / 2).map((genre, index) => {
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
                  <motion.div
                    className="genre-text genre-title"
                    initial="initial"
                    animate="translate"
                    variants={translateInX(10, index / 2)}
                  >
                    {genre[1]}
                  </motion.div>
                </div>
              )
            })}
          </div>
        </div>
        <div className="container">
          <div className="row mb-5 mt-5">
            <div className="col d-flex flex-row justify-content-center full-button flex">
              <Link to="/dashboard">Back To Dashboard ←</Link>
              <Link to="/insights/all">Top Tracks & Artists →</Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Genres
