(async () => {
	const { Chalk } = await import('chalk')

	const c = new Chalk({ level: 3 })

	const up = (i, steps) => Math.round(i * (255 / (steps - 1))).toString(16).padStart(2, '0')
	const down = (i, steps) => (255 - Math.round(i * (255 / (steps - 1)))).toString(16).padStart(2, '0')

	const colors = {}
	for (let i = 0; i < 26; i++) {
		let color
		if (i < 6) { // rouge à jaune
			const redhex = 'ff'
			const greenhex = up(i, 6)
			const bluehex = '00'

			color = `#${redhex}${greenhex}${bluehex}`
		} else if (i < 12) { // jaune à vert
			const redhex = down(i - 5, 7)
			const greenhex = 'ff'
			const bluehex = '00'

			color = `#${redhex}${greenhex}${bluehex}`
		} else if (i < 19) { // vert à cyan
			const redhex = '00'
			const greenhex = 'ff'
			const bluehex = up(i - 11, 8)

			color = `#${redhex}${greenhex}${bluehex}`
		} else { // rgb 0ff
			const redhex = up(i - 18, 8)
			const greenhex = down(i - 18, 8)
			const bluehex = 'ff'

			color = `#${redhex}${greenhex}${bluehex}`
		}

		//console.log(c.hex(color)(String.fromCharCode('a'.charCodeAt(0) + i) + ' ' + color + ' ' + i))
		colors[String.fromCharCode('a'.charCodeAt(0) + i)] = c.hex(color)(String.fromCharCode('a'.charCodeAt(0) + i))
	}

	return { ...colors, walk: (letter) => c.bgWhite(letter) }
})().then(colors => {
	const { readFileSync } = require('node:fs')

	const fileContent = readFileSync('./input.txt', { encoding: 'utf-8' }).trimEnd()

	// elevation map
	let starts = []
	let end
	const map = fileContent.split('\n').map((row, i) => row.split('').map((letter, j) => {
		// NEW RULE: every "a" is a start
		if (letter === 'S' || letter === 'a') {
			starts.push([i, j])
			return 0
		}
		if (letter === 'E') {
			end = [i, j]
			return 25
		}
		return letter.codePointAt(0) - 'a'.codePointAt(0)
	}))

	//console.log(map)

	// find shortest path to every point
	// queue = shift to get, push to set
	const queues = starts.map((start) => ({ steps: 0, path: [], position: [...start]}))
	const walkedOn = starts.map((start) => start.join('-'))

	const directions = [
		[0, 1],
		[1, 0],
		[0, -1],
		[-1, 0],
	]

	//let stopper = 0

	let shortest

	while (queues.length /*&& stopper < 10*/) {
		const { steps, path, position } = queues.shift()
		const [cx, cy] = position

		if (cx === end[0] && cy === end[1]) {
			shortest = { steps, path }
			break
		}

		directions.forEach(([dx, dy]) => {

			if (
				// ignore tiles already walked on,
				walkedOn.includes([cx + dx, cy + dy].join('-'))
				// tiles out of boundaries,
				|| cx + dx < 0
				|| cy + dy < 0
				|| cx + dx >= map.length
				|| cy + dy >= map[0].length
				// and unclimbable tiles
				|| map[cx + dx][cy + dy] > map[cx][cy] + 1
			) return

			// when we arrive here, we have the shortest path from start to the new position
			// save it
			queues.push({
				steps: steps + 1,
				path: [...path, position.join('-')],
				position: [cx + dx, cy + dy]
			})

			// and mark it as walked on
			walkedOn.push([cx + dx, cy + dy].join('-'))
		})
		
		//stopper++
	}

	console.log(shortest)

	let result = ''
	const width = map[0].length + 1
	;[...fileContent].forEach((letter, index) => {
		const coords = [Math.floor(index / width), index % width]
		result += shortest.path.includes(coords.join('-')) ? colors.walk(letter) : colors[letter] ?? letter
	})

	console.log(result)
})