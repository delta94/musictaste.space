import React, { useEffect, useState } from 'react'
import approximatePercentile from '../../util/approximatePercentile'
interface ObscurifyProps {
  score: number
  average: {
    hasRegion: boolean
    region?: string
    data: INationalAverage
    stdDev: number
  }
}
const Obscurify = ({ score, average }: ObscurifyProps) => {
  const [percentage, setPercentage] = useState(0)
  useEffect(() => {
    if (score && Object.entries(average).length) {
      setPercentage(
        approximatePercentile(average.data.score, average.stdDev, score)
      )
    }
  }, [average, average.stdDev, score])

  return (
    <div className="obscurify w-100 h-100 pb-5">
      <div className="container d-flex flex-column justify-content-center align-items-center mt-5">
        <div className="heading">Your Obscurify Score</div>

        {score && Object.entries(average).length ? (
          <>
            <div className="score">{score.toFixed(1)}</div>
            <div className="hint">
              (The lower the score, the more obscure your taste.)
            </div>
            <div className="row">
              <div className="col-md-6">
                <div className="d-flex flex-column align-items-center justify-content-center">
                  <div
                    className="sub-heading text-center"
                    style={{ marginBottom: '-0.5em' }}
                  >
                    more obscure than
                  </div>
                  <div className="average-score">
                    {Math.round(100 - percentage * 100)}%
                  </div>
                  <div
                    className="sub-heading text-center pb-2"
                    style={{ fontSize: '1.1em', marginTop: '-0.5em' }}
                  >
                    of{' '}
                    {average.data.total
                      .toString()
                      .replace(/(\d)(?=(\d\d\d)+(?!\d))/g, '$1,')}{' '}
                    other users{' '}
                    {average.hasRegion ? `in ${average.region}` : 'globally'}
                  </div>
                </div>
              </div>
              <div className="col-md-6 d-flex flex-column align-items-center justify-content-center">
                <div className="explanation text-center">
                  Your score is based on the popularity of your favorite
                  artists. The lower the score, the more obscure your taste. The
                  higher the score, the more mainstream - think of it as being
                  more relatable. Calculated using the{' '}
                  <a href="https://obscurifymusic.com/">Obscurify</a> algorithm.
                </div>
              </div>
            </div>
          </>
        ) : null}
      </div>
    </div>
  )
}

export default Obscurify
