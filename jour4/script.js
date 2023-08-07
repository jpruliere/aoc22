const { readFileSync } = require('node:fs')

const fileContent = readFileSync('./input.txt', { encoding: 'utf-8' })

console.log(fileContent.split('\n').reduce((fullOverlaps, pair) => {
	if (pair.length === 0) return fullOverlaps
	const [elf1, elf2] = pair.split(',').map((range) => {
		const [min, max] = range.split('-').map((n) => parseInt(n))

		return { min, max }
	})

	if (
		 (elf1.min <= elf2.min && elf1.max >= elf2.max)
	|| (elf2.min <= elf1.min && elf2.max >= elf1.max)
	) return fullOverlaps + 1
	return fullOverlaps
}, 0))

console.log(fileContent.split('\n').reduce((overlaps, pair) => {
	if (pair.length === 0) return overlaps
	const [elf1, elf2] = pair.split(',').map((range) => {
		const [min, max] = range.split('-').map((n) => parseInt(n))

		return { min, max }
	})

	if (
		 (elf1.min <= elf2.min && elf1.max >= elf2.min)
	|| (elf2.min <= elf1.min && elf2.max >= elf1.min)
	) return overlaps + 1
	return overlaps
}, 0))