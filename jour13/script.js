const { readFileSync } = require('node:fs')

const textualPairs = readFileSync('./input.txt', { encoding: 'utf-8' }).trimEnd().split('\n\n')

const pairs = textualPairs.map((pair) => pair.split('\n').map(eval))


const compare = (l, r) => {
  if (Number.isInteger(l) && Number.isInteger(r)) {
    if (l === r) return undefined
    if (l < r) return true
    return false
  }

  l = [l].flat()
  r = [r].flat()

  let index = 0
  let order = undefined

  while (index < l.length && index < r.length && order === undefined) {
    order = compare(l[index], r[index])
    index++
  }

  return order ?? (l.length === r.length ? undefined : l.length < r.length)
}

let pairIndex = 1
const orders = pairs.map((pair) => compare(...pair))

const answer = orders.reduce((sum, val, i) => val ? sum + i + 1: sum)

console.log(answer)

// Part two

const dividers = [
  [[2]],
  [[6]]
]

const allPairs = [...pairs.flat(), ...dividers]

const sorted = allPairs.sort((a, b) => compare(a, b) ? -1 : 1)

const answerB = (sorted.indexOf(dividers[0]) + 1) * (sorted.indexOf(dividers[1]) + 1)

console.log(answerB)