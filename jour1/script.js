const { readFileSync } = require('node:fs')

const fileContent = readFileSync('./input.txt', { encoding: 'utf-8' })

let max = fileContent
	.split('\n\n')
	.reduce((max, cur) =>
		Math.max(max, cur.split('\n').reduce((acc, val) => acc + Number(val), 0)),
		0
	)

console.log(max)

let top3 = fileContent
	.split('\n\n')
	.map((elf) =>
		elf.split('\n').reduce((acc, val) => acc + Number(val), 0)
	)
	.sort((a, b) => b - a)
	.slice(0, 3)

console.log(top3.reduce((sum, elf) => sum + elf, 0))