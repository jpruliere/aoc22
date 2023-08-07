const { readFileSync } = require('node:fs')

const fileContent = readFileSync('./input.txt', { encoding: 'utf-8' })

const [map, instructions] = fileContent.split('\n\n')

const [laneNumbers, ...rows] = map.split('\n').reverse()

const extract = (line) => [...line.matchAll(/.{3} ?/g)].map(([str]) => str[1])

const lanes = Object.fromEntries(extract(laneNumbers).map((number) => [number, []]))

rows.forEach((row) => extract(row).forEach((letter, index) => {
	if (letter === ' ') return
	lanes[index + 1].push(letter)
}))

instructions.split('\n').forEach((instr) => {
	if (instr === '') return
	const [, amount, from, to] = instr.match(/move (.+) from (.) to (.)/)

	for (let index = 0; index < amount; index++) {
		lanes[to].push(lanes[from].pop())
	}
})

console.log(Object.values(lanes).map((l) => l.pop()).join(''))

const lanes2 = Object.fromEntries(extract(laneNumbers).map((number) => [number, []]))

rows.forEach((row) => extract(row).forEach((letter, index) => {
	if (letter === ' ') return
	lanes2[index + 1].push(letter)
}))

instructions.split('\n').forEach((instr) => {
	if (instr === '') return
	const [, amount, from, to] = instr.match(/move (.+) from (.) to (.)/)

	const bulk = []
	for (let index = 0; index < amount; index++) {
		bulk.unshift(lanes2[from].pop())
	}
	lanes2[to].push(...bulk)
})

console.log(Object.values(lanes2).map((l) => l.pop()).join(''))