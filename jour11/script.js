const { readFileSync } = require('node:fs')

const fileMonkeys = readFileSync('./input.txt', { encoding: 'utf-8' }).split('\n\n')
const testMonkeys = readFileSync('./test.txt', { encoding: 'utf-8' }).split('\n\n')

const monkeys = Array(testMonkeys.length).fill(true).map(() => ({}))

const parseItems = (string) => string.substring('Starting items: '.length).split(',').map(v => +v)

const parseOperation = (string) => (old) => {
	let n

	eval(string.substring('Operation: '.length).replace('new', 'n'))

	return n
}

const parseDivisor = (string) => +string.substring('Test: divisible by '.length)

const parseTest = (string) => (val) => {
	const divisor = parseDivisor(string)

	return val % divisor === 0
}

let lcm = 1

const parseIf = (string) => +string.split(' ').reverse()[0]

testMonkeys.forEach((r) => {
	const [monkeyNumber, items, operation, test, ifTrue, ifFalse] = r.split('\n').map((s) => s.trim())

	const currentMonkey = monkeys[+monkeyNumber.substring('Monkey '.length).replace(':','')]
	currentMonkey.items = parseItems(items)
	currentMonkey.operation = parseOperation(operation)
	lcm *= parseDivisor(test)
	currentMonkey.test = parseTest(test)
	currentMonkey.ifTrue = monkeys[parseIf(ifTrue)]
	currentMonkey.ifFalse = monkeys[parseIf(ifFalse)]
	currentMonkey.expertise = 0
})

const playRound = (simians) => {
	simians.forEach((m, idx) => {
		//console.log(`Monkey ${idx}:`)
		m.items.forEach(i => {
			m.expertise++
			//console.log(`  Monkey inspects an item with a worry level of ${i}.`)
			// worry
			i = m.operation(i)
			// console.log(`    Worry level increases to ${i}.`)
			// relief
			i = Math.floor(i / 3)
			// console.log(`    Monkey gets bored with item. Worry level is divided by 3 to ${i}.`)
			// test
			if (m.test(i)) {
				// console.log(`    Current worry level tested true.\n    Item with worry level ${i} is thrown to monkey ${simians.indexOf(m.ifTrue)}.`)
				m.ifTrue.items.push(i)
			} else {
				// console.log(`    Current worry level tested false.\n    Item with worry level ${i} is thrown to monkey ${simians.indexOf(m.ifFalse)}.`)
				m.ifFalse.items.push(i)
			}
		})
		m.items.length = 0
	})
}

for (let i = 0; i < 20; i++)
	playRound(monkeys)

console.log(monkeys)

// const monkeyExperts = monkeys.map((m) => m.expertise).sort((a, b) => b - a).slice(0, 2)

// //monkey business
// console.log(((a, b) => a * b)(...monkeyExperts))

// B

// const playHardcoreRound = (simians) => {
// 	simians.forEach((m, idx) => {
// 		//console.log(`Monkey ${idx}:`)
// 		m.items.forEach(i => {
// 			m.expertise++
// 			//console.log(`  Monkey inspects an item with a worry level of ${i}.`)
// 			// worry
// 			i = m.operation(i % lcm)
// 			// console.log(`    Worry level increases to ${i}.`)
// 			// no relief
// 			// console.log(`    Monkey gets bored with item. Worry level is divided by 3 to ${i}.`)
// 			// test
// 			if (m.test(i)) {
// 				// console.log(`    Current worry level tested true.\n    Item with worry level ${i} is thrown to monkey ${simians.indexOf(m.ifTrue)}.`)
// 				m.ifTrue.items.push(i)
// 			} else {
// 				// console.log(`    Current worry level tested false.\n    Item with worry level ${i} is thrown to monkey ${simians.indexOf(m.ifFalse)}.`)
// 				m.ifFalse.items.push(i)
// 			}
// 		})
// 		m.items.length = 0
// 	})
// }

// for (let i = 0; i < 1e4; i++)
// 	playHardcoreRound(monkeys)

// const monkeyExperts = monkeys.map((m) => m.expertise).sort((a, b) => b - a).slice(0, 2)

// //monkey business
// console.log(((a, b) => a * b)(...monkeyExperts))