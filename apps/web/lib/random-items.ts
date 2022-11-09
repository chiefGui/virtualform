import { getRandomInt } from './get-random-int'

export function randomItems(length: number) {
  return Array.from({ length }, () => {
    return `https://source.unsplash.com/random/100x100?sig=${getRandomInt(
      500,
      1000
    )}`
  })
}
