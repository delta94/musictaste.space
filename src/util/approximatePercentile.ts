import NormalDistribution from 'normal-distribution'

/**
 * Approximates the percentile given a normal distribution.
 */
export default (mean: number, stdev: number, x: number) => {
  const normDist = new NormalDistribution(mean, stdev)
  return normDist.cdf(x)
}
