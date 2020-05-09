import React from 'react'

interface ObscurifyProps {
  score: number
  average: { hasRegion: boolean; region?: string; data: INationalAverage }
}
const Obscurify = ({ score, average }: ObscurifyProps) => {
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
                  <div className="sub-heading">
                    Average{' '}
                    {average.hasRegion
                      ? `In ${average.region} Region`
                      : 'Globally'}
                    <br />
                  </div>
                  <div className="average-score">
                    {average.data.score.toFixed(1)}
                  </div>
                </div>
              </div>
              <div className="col-md-6">
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
