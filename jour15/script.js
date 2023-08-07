const { readFileSync } = require('node:fs')

const env = 'input'

const row = env === 'test' ? 10 : 2e6
const beaconsOnTheRow = new Set()

const sensorReadings = readFileSync(`./${env}.txt`, { encoding: 'utf-8' })
  .trimEnd()
  .split('\n')
  .map((reading) => {
    const [, sx, sy, bx, by] = reading.split('=').map((part) => Number(part.split(',')[0].split(':')[0]))

    const manhattan = Math.abs(sx - bx) + Math.abs(sy - by)

    const slopes = {
      ne: sy - manhattan - sx,
      sw: sy + manhattan - sx,
      nw: sy - manhattan + sx,
      se: sy + manhattan + sx,
    }

    if (by === row) beaconsOnTheRow.add(bx)

    return { sx, sy, bx, by, manhattan, slopes }
  })

//console.log(sensorReadings)


const noBeaconLand = new Set()

sensorReadings.forEach((reading) => {
  const distanceLeft = reading.manhattan - Math.abs(reading.sy - row)

  //console.log({ ...reading, distanceLeft })

  if (distanceLeft <= 0) return

  for (let x = reading.sx - distanceLeft; x <= reading.sx + distanceLeft; x++) {
    if (!beaconsOnTheRow.has(x))
      noBeaconLand.add(x)
  }
})

//console.log(noBeaconLand.size)

// B

const boundary = env === 'test' ? 20 : 4e6

const candidatesA = new Map()
const candidatesB = new Map()

sensorReadings.forEach((bottomReading, i) => {
  sensorReadings.forEach((topReading) => {
    if (bottomReading === topReading) return

    const deltaA = bottomReading.slopes.ne - topReading.slopes.sw
    if ([2, 3, 4].includes(deltaA)) {
      candidatesA.set(topReading.slopes.sw + 1, deltaA > 2)
    }
    const deltaB = bottomReading.slopes.nw - topReading.slopes.se
    if ([2, 3, 4].includes(deltaB)) {
      candidatesB.set(topReading.slopes.se + 1, deltaB > 2)
    }
  })
})

console.log(candidatesA)
console.log(candidatesB)

const intersections = []

candidatesA.forEach((la, a) => {
  candidatesB.forEach((lb, b) => {
    if (la && lb) return console.log(`${a} and ${b} are both loose`) // both loose, not sufficient
    if (!la && !lb && (Math.abs(a % 2) !== Math.abs(b % 2))) return console.log(`${a} and ${b} are tight but one is even, the other is odd`) // slopes won't cross on a integer

    // if one is loose and a and b are one even, one odd, increment the loose one
    if (la && (Math.abs(a % 2) !== Math.abs(b % 2))) {
      console.log(`${a} is loose, let's increment it to match ${b}`)
      a++
    }
    if (lb && (Math.abs(a % 2) !== Math.abs(b % 2))) {
      console.log(`${b} is loose, let's increment it to match ${a}`)
      b++
    }

    const y = (a + b) / 2
    const x = y - a

    intersections.push({ x, y })
  })
})

// console.log(intersections)

intersections.forEach(({ x, y }) => {
  const impossible = sensorReadings.find(({ sx, sy, manhattan }) => {
    const manhattanToLostBeacon = Math.abs(sx - x) + Math.abs(sy - y)

    return manhattanToLostBeacon < manhattan
  })

  if (!impossible) console.log(x * 4e6 + y)
})

/*let validReadings = 0

let sl = sensorReadings.length

let [lx, ly] = [ boundary / 2, boundary / 2 ]

let i = 0

while (validReadings < sl && i < 10) {
  const reading = sensorReadings[i++ % sl]
  //console.log(reading)

  const manhattanToLostBeacon = Math.abs(reading.sx - lx) + Math.abs(reading.sy - ly)

  if (manhattanToLostBeacon > reading.manhattan) {
    validReadings++
  } else {
    validReadings = 0
    const diff = reading.manhattan - manhattanToLostBeacon
    const diffx = Math.ceil(diff * Math.random())
    const diffy = diff - diffx + 1

    // x
    if (lx > reading.sx) {
      // pousse à droite
      lx += diffx
    } else {
      // pousse à gauche
      lx -= diffx
    }

    // y
    if (ly > reading.sy) {
      ly += diffy
    } else {
      ly -= diffy
    }

    //console.log(`Sensor at ${reading.sx}-${reading.sy} moved lost beacon to ${lx}-${ly}`)
  }
}

console.log(`Stabilized at ${lx}-${ly}`)*/