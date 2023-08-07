const { readFileSync } = require('node:fs')

const fileContent = readFileSync('./alex.txt', { encoding: 'utf-8' })

class File {
	constructor(name, size) {
		this.name = name
		this.size = Number(size)
	}

	totalSize() {
		return this.size
	}
}

class Folder {
	static folders = []

	constructor(name) {
		this.name = name
		this.content = []
		Folder.folders.push(this)
	}

	attach(fileOrFolder) {
		this.content.push(fileOrFolder)
		if (fileOrFolder instanceof Folder) fileOrFolder.parent = this
	}

	fullPath() {
		if (this.parent !== this) return this.parent.fullPath() + this.name + '/'
		else return '/'
	}

	totalSize() {
		return this.content.reduce((sum, f) => sum + f.totalSize(), 0)
	}
}

const root = new Folder('/')
root.parent = root

let pointer = root

fileContent.split('\n').forEach((cmd) => {
	if (cmd === '$ cd /' || cmd.length === 0) return
	if (cmd.startsWith('dir ')) {
		pointer.attach(new Folder(cmd.substring(4)))
	} else if (!cmd.startsWith('$ ')) {
		pointer.attach(new File(...cmd.split(' ').reverse()))
	} else if (cmd.startsWith('$ cd')) {
		if (cmd.endsWith('..')) {
			pointer = pointer.parent
		} else {
			pointer = pointer.content.find((f) => f.name === cmd.substring(5))
		}
	}
})

console.log(Folder.folders.filter((f) => f.totalSize() <= 100000).reduce((sum, f) => sum + f.totalSize(), 0))

const extraSpaceNeeded = 30000000 - (70000000 - root.totalSize())

console.log(Folder.folders.sort((a, b) => a.totalSize() - b.totalSize()).find(f => f.totalSize() > extraSpaceNeeded).totalSize())