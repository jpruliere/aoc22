const { readFileSync } = require('node:fs')

const rockPaths = readFileSync('./input.txt', { encoding: 'utf-8' })
  .trimEnd()
  .split('\n')
  .map((path) => path.split(' -> ').map((coord) => coord.split(',').map(Number)))

const maxRockDepth = Math.max(...rockPaths.flat().map(([, y]) => y))

const rocks = new Set()

rockPaths.forEach((path) => {
  path.forEach((coord, pos) => {
    if (pos === path.length - 1) return

    const nextCoord = path[pos + 1]

    const [minx, maxx] = [
      Math.min(coord[0], nextCoord[0]),
      Math.max(coord[0], nextCoord[0])
    ]

    const [miny, maxy] = [
      Math.min(coord[1], nextCoord[1]),
      Math.max(coord[1], nextCoord[1])
    ]

    for (let x = minx; x <= maxx; x++)
      for (let y = miny; y <= maxy; y++)
        rocks.add(`${x}-${y}`)
  })
})

const sandStart = [500, 0]

let grain = [...sandStart]

let grainsCount = 0

const fallTrajectories = [
  [0, 1],
  [-1, 1],
  [1, 1]
]

while (grain[1] < maxRockDepth) {
  const favoredTrajectory = fallTrajectories.find(([fx, fy]) => !rocks.has(`${grain[0] + fx}-${grain[1] + fy}`))

  if (!favoredTrajectory) {
    //console.log(`A grain of sand comes to rest at [${grain[0]}, ${grain[1]}]`)
    rocks.add(`${grain[0]}-${grain[1]}`)
    grainsCount++
    grain = [...sandStart]
  } else {
    grain = [grain[0] + favoredTrajectory[0], grain[1] + favoredTrajectory[1]]
  }
}

console.log('A -> ', grainsCount)

// Part two

const sandCork = sandStart.join('-')

while (!rocks.has(sandCork)) {
  const favoredTrajectory = fallTrajectories.find(([fx, fy]) => !rocks.has(`${grain[0] + fx}-${grain[1] + fy}`))

  if (!favoredTrajectory || grain[1] === maxRockDepth + 1) {
    //console.log(`A grain of sand comes to rest at [${grain[0]}, ${grain[1]}]`)
    rocks.add(`${grain[0]}-${grain[1]}`)
    grainsCount++
    grain = [...sandStart]
  } else {
    grain = [grain[0] + favoredTrajectory[0], grain[1] + favoredTrajectory[1]]
  }
}

console.log('B -> ', grainsCount)

// if (grain[0] === maxRockDepth + 1 || !favoredTraj)