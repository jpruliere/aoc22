const { readFileSync } = require('node:fs')

const env = 'test'

const valves = Object.fromEntries(
  readFileSync(`./${env}.txt`, { encoding: 'utf-8' })
  .trimEnd()
  .split('\n')
  .map((row) => {
    let flow
    let [name, links] = row.split('=')

    ;[flow, links] = links.split('; ')

    name = name.replace('Valve ', '').replace(' has flow rate', '')
    flow = Number(flow)
    links = links.replace(/tunnels? leads? to valves? /, '').split(', ')

    return [name, { name, flow, links }]
  })
)

const start = 'AA'

Object.entries(valves).forEach(([, valve]) => {
  // valve.links = Object.fromEntries(
  //   valve.links.map((name) => [name, valves[name]])
  // )

  const positions = [{ valve, distance: 0 }]
  const visited = []

  const distances = {}

  while (positions.length > 0) {
    const { valve, distance } = positions.shift()

    if ((valve.flow > 0 || valve.name === start) && distance > 0) distances[valve.name] = distance

    visited.push(valve.name)

    valve.links.forEach((name) => {
      if (!visited.includes(name)) {
        positions.push({ valve: valves[name], distance: distance + 1 })
      }
    })
  }

  valve.distances = distances
})

const relevantValves = Object.fromEntries(Object.entries(valves).filter(([, { name, flow }]) => flow > 0 || name === start))

console.log(Object.keys(relevantValves).length)
process.exit()

const findPaths = (distances, path, flow = 0, minutes = 30) => {
  const results = []

  for (const destination in distances) {
    const minutesLeft = minutes - distances[destination] - 1
    if (minutesLeft <= 0) {
      break
    }

    const newFlow = flow + relevantValves[destination].flow * minutesLeft
    const newPath = [...path, destination]

    const nextDistancesAsEntries = Object.entries(relevantValves[destination].distances).filter(([name, distance]) => !path.includes(name) && distance < minutesLeft / 2)

    if (nextDistancesAsEntries.length) {
      //console.log(`from ${newPath.join('-')}, considering ${nextDistancesAsEntries.map(([name]) => name).join(', ')}`)
      results.push(...findPaths(Object.fromEntries(nextDistancesAsEntries), newPath, newFlow, minutesLeft))
    } else {
      results.push({ path: newPath.join('-'), flow: newFlow })
    }
  }

  if (!results.length) results.push({ path, flow })
  return results
}

const paths = findPaths(relevantValves[start].distances, [start])

console.log(paths.reduce((max, cur) => {
  if (cur.flow > max.flow) return cur
  return max
}, { flow: 0 }))