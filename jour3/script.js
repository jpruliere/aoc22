const { readFileSync } = require('node:fs')

const fileContent = readFileSync('./input.txt', { encoding: 'utf-8' })

const getPriority = (letter) => {
	if (letter.toLowerCase() === letter) return letter.charCodeAt(0) - 'a'.charCodeAt(0) + 1
	return letter.charCodeAt(0) - 'A'.charCodeAt(0) + 27
}

console.log(fileContent.split('\n').reduce((sum, row) => {
	if (row.length === 0) return sum
	const leftCompartment = row.substring(0, row.length / 2)
	const rightCompartment = row.substring(row.length / 2)

	const misplaced = leftCompartment.split('').find((letter) => rightCompartment.includes(letter))
	return sum + getPriority(misplaced)
}, 0))

console.log(fileContent.split('\n').reduce((groups, sack, idx) => {
	if (sack.length === 0) return groups

	if (idx % 3 === 0) groups.push([])

	groups[groups.length - 1].push(sack)

	return groups
}, []).reduce((sum, group) => {
	const [elf1, ...elves] = group

	const badge = elf1.split('').find((letter) => elves.every((elf) => elf.includes(letter)))

	return sum + getPriority(badge)
}, 0))