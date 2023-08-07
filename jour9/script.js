const { readFileSync } = require('node:fs')

const fileContent = readFileSync('./input.txt', { encoding: 'utf-8' })

const instructions = fileContent.split('\n').filter(r => r).map((r) => {
	const [direction, steps] = r.split(' ')
	return { direction, steps }
})

const testContent = readFileSync('./testb.txt', { encoding: 'utf-8' })

const testInstructions = testContent.split('\n').filter(r => r).map((r) => {
	const [direction, steps] = r.split(' ')
	return { direction, steps }
})

const moveHead = (direction, head) => {
	switch (direction) {
		case 'U':
			head[0]++
			break
		case 'D':
			head[0]--
			break
		case 'R':
			head[1]++
			break
		case 'L':
			head[1]--
			break
	}
}

const updateTail = (tail, head) => {
	const diffX = Math.abs(head[0] - tail[0])
	const diffY = Math.abs(head[1] - tail[1])
	const incrX = Math.sign(head[0] - tail[0])
	const incrY = Math.sign(head[1] - tail[1])
	if (![1, 2, 4].includes((diffX + 1) * (diffY + 1))) {
		// tail need to move
		tail[0] += incrX
		tail[1] += incrY
	}
}

const head = [0, 0]
let tail = [0, 0]

const uniqueTilesA = new Set([`0*0`])

instructions.forEach(({ direction, steps }) => {
	for (let s = 0; s < steps; s++) {
		moveHead(direction, head)
		updateTail(tail, head)
		uniqueTilesA.add(tail.join('*'))
	}
})

console.log(uniqueTilesA.size)

const h = [0, 0]
const knots = Array(9).fill(true).map(() => [0, 0])
knots.unshift(h)

const uniqueTilesB = new Set([`0*0`])

instructions.forEach(({ direction, steps }) => {
	for (let s = 0; s < steps; s++) {
		moveHead(direction, h)
		for (let k = 1; k < knots.length; k++) {
			updateTail(knots[k], knots[k - 1])
		}
		uniqueTilesB.add(knots[9].join('*'))
	}
})

console.log(uniqueTilesB.size)