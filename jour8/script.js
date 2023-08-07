const { red, green } = require('chalk')

const { readFileSync } = require('node:fs')

const fileContent = readFileSync('./input.txt', { encoding: 'utf-8' })

const visibles = new Set()

const grid = fileContent.split('\n').filter(r => r).map((row) => row.split(''))

for (let i = 0; i < grid.length; i++) {

	// from left
	let tallest = -1
	for (let pos = 0; pos < grid[i].length && tallest < 9; pos++)
		if (Number(grid[i][pos]) > tallest) {
			tallest = Number(grid[i][pos])
			visibles.add(`${i}-${pos}`)
		}

	// from right
	tallest = -1
	for (let pos = grid[i].length - 1; pos > -1 && tallest < 9; pos--)
		if (Number(grid[i][pos]) > tallest) {
			tallest = Number(grid[i][pos])
			visibles.add(`${i}-${pos}`)
		}

	// from up
	tallest = -1
	for (let pos = 0; pos < grid.length && tallest < 9; pos++)
		if (Number(grid[pos][i]) > tallest) {
			tallest = Number(grid[pos][i])
			visibles.add(`${pos}-${i}`)
		}

	// from down
	tallest = -1
	for (let pos = grid.length - 1; pos > -1 && tallest < 9; pos--)
		if (Number(grid[pos][i]) > tallest) {
			tallest = Number(grid[pos][i])
			visibles.add(`${pos}-${i}`)
		}
}

let cnt = 0
for (let i = 0; i < grid.length; i++) {
	let row = ''
	for (let j = 0; j < grid[i].length; j++) {
		if (visibles.has(`${i}-${j}`)) {
			cnt++
			row += green(grid[i][j])
		} else row += red(grid[i][j])
	}
	console.log(row)
}

console.log(visibles.size)

let greatest = 0
for (let i = 1; i < grid.length - 1; i++) {
	for (let j = 1; j < grid[i].length - 1; j++) {
		const tree = grid[i][j]
		// left
		const lview = grid[i].slice(0, j).reverse()
		let left = lview.findIndex((neighbor) => neighbor >= tree) + 1
		if (left === 0) left = lview.length
		// right
		const rview = grid[i].slice(j + 1)
		let right = rview.findIndex((neighbor) => neighbor >= tree) + 1
		if (right === 0) right = rview.length
		// up
		const uview = grid.map((r) => r[j]).slice(0, i).reverse()
		let up = uview.findIndex((neighbor) => neighbor >= tree) + 1
		if (up === 0) up = uview.length
		// down
		const dview = grid.map((r) => r[j]).slice(i + 1)
		let down = dview.findIndex((neighbor) => neighbor >= tree) + 1
		if (down === 0) down = dview.length

		const scenic = left * right * up * down
		if (scenic > greatest) greatest = scenic
	}
}

console.log(greatest)