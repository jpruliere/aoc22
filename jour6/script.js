const { readFileSync } = require('node:fs')

const fileContent = readFileSync('./input.txt', { encoding: 'utf-8' })

let char = 4
const marker = fileContent.substring(0, char).split('')

while (new Set(marker).size < 4) {
	char++
	marker.shift()
	marker.push(fileContent[char - 1])
}

console.log(char)

let char2 = 14
const message = fileContent.substring(0, char2).split('')

while (new Set(message).size < 14) {
	char2++
	message.shift()
	message.push(fileContent[char2 - 1])
}

console.log(char2)