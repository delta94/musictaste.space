const transition = (duration = 0.5) => ({
  duration,
  ease: [0.43, 0.13, 0.23, 0.96],
})

export const zoomFadeIn = (delay = 0, duration = 0.5) => ({
  initial: { scale: 0.9, opacity: 0 },
  enter: {
    scale: 1,
    opacity: 1,
    transition: { delay, ...transition(duration) },
  },
  exit: {
    scale: 0.5,
    opacity: 0,
    transition: { ...transition, duration: 1.5 },
  },
})

export const fromLeft = (delay = 0) => ({
  initial: { x: -50, opacity: 0 },
  enter: { x: 0, opacity: 1, transition: { delay, ...transition() } },
})

export const fromBottom = (delay = 0) => ({
  initial: { y: 50, opacity: 0 },
  enter: { y: 0, opacity: 1, transition: { delay, ...transition() } },
})

export const float = (delay = 0, duration = 2) => ({
  float: {
    y: ['0%', '5%', '0%'],
    transition: { duration, ease: 'easeInOut', loop: Infinity, delay },
  },
})

export const growAndShrink = (size = 1.1, delay = 0, duration = 2) => ({
  growAndShrink: {
    scale: [1, size, 1],
    transition: { duration, ease: 'easeInOut', loop: Infinity, delay },
  },
})

export const shrinkOnHover = (scale = 0.95) => ({
  initial: { opacity: 0 },
  enter: { opacity: 1 },
  exit: { opacity: 0 },
  hover: { scale, transition },
})

export const scaleInX = (amount = 1.1, delay = 0, duration = 2) => ({
  initial: { originX: 0 },
  scale: {
    scaleX: [1, amount, 1],
    transition: { duration, ease: 'easeInOut', loop: Infinity, delay },
  },
})

export const translateInX = (amount = 1, delay = 0, duration = 2) => ({
  initial: { originX: 0 },
  translate: {
    x: [0, amount, 0],
    transition: { duration, ease: 'easeInOut', loop: Infinity, delay },
  },
})
