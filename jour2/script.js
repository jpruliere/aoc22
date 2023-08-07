const { readFileSync } = require('node:fs')

const fileContent = readFileSync('./input.txt', { encoding: 'utf-8' })

const points = {
	X: 1,
	Y: 2,
	Z: 3,
}

const wins = ['A Y', 'B Z', 'C X']
const draws = ['A X', 'B Y', 'C Z']

let finalScore = fileContent.split('\n').reduce((score, pair) => {
	if (pair.length < 3) return score
	const [, , me] = pair.split('')
	score += points[me]

	// draw
	if (draws.includes(pair)) score += 3
	else if (wins.includes(pair)) score += 6

	return score
}, 0)

console.log(finalScore)

const needs = {
	X: 0,
	Y: 3,
	Z: 6,
}

const opponentPoints = {
	A: 1,
	B: 2,
	C: 3,
}

const moves = {
	1: 'rock',
	2: 'paper',
	3: 'scissors',
	X: 'lose',
	Y: 'draw',
	Z: 'win',
}

let trueFinalScore = fileContent.split('\n').reduce((score, pair) => {
	if (pair.length < 3) return score
	const [opponent, , need] = pair.split('')

	let me
	switch (need) {
		case 'X': // lose
			me = (opponentPoints[opponent] + 1) % 3 + 1
			break
		case 'Y': // draw
			me = opponentPoints[opponent]
			break
		case 'Z': // win
			me = (opponentPoints[opponent]) % 3 + 1
			break
	}

	return score + me + needs[need]
}, 0)

console.log(trueFinalScore)