const { readFileSync } = require('node:fs')

const fileContent = readFileSync('./input.txt', { encoding: 'utf-8' })

const ops = fileContent.split('\n').filter(r => r).map((r) => {
	const [op, arg] = r.split(' ')
	if (op === 'addx') return [['addx1'], ['addx2', arg]]
	return [[op, arg]]
}).flat()

const noop = (x) => x

const addx1 = (x) => x
const addx2 = (x, plus) => x + plus

const cpu = { noop, addx1, addx2, x: 1 }

let cycle = 1
let strength = 0
ops.forEach(([op, arg]) => {
	if ([20, 60, 100, 140, 180, 220].includes(cycle)) {
		console.log(`-> Strength += ${cycle * cpu.x}`)
		strength += cycle * cpu.x
	}
	cpu.x = cpu[op](cpu.x, Number(arg))

	console.log(`Cycle ${cycle} ${op} > X(${cpu.x})`)
	cycle++
})

console.log(strength)

// B

let crt = ''
let crtPosition = 0
cpu.x = 1

ops.forEach(([op, arg]) => {
	if (crtPosition >= cpu.x - 1 && crtPosition <= cpu.x + 1) {
		crt += '█'
	} else {
		crt += ' '
	}

	cpu.x = cpu[op](cpu.x, Number(arg))

	crtPosition = (crtPosition + 1) % 40
})

let pos = 40
while (pos <= crt.length) {
	console.log(crt.substring(pos - 40, pos))
	pos += 40
}