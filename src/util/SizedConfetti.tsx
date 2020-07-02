/* eslint-disable react/display-name */
import React from 'react'
import ReactConfetti from 'react-confetti'
import useWindowSize from '../hooks/useWindowSize'

export default React.forwardRef(
  (passedProps, ref: React.Ref<HTMLCanvasElement>) => {
    const { width, height } = useWindowSize()
    return (
      <ReactConfetti width={width} height={height} {...passedProps} ref={ref} />
    )
  }
)
