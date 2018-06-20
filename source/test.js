'use strict'

const cartera = require('./')
const { deepEqual } = require('assert-helpers')
const fs = require('fs').promises
const pathUtil = require('path')
const sortObject = require('sortobject')

const outPath = pathUtil.join(__dirname, '../example.out.json')
const inPath = pathUtil.join(__dirname, '../example.json')

async function main () {
	try {
		const expectedString = await fs.readFile(outPath, 'utf8')
		const expectedData = JSON.parse(expectedString)
		const actualData = await cartera({ path: inPath, output: 'none' })
		deepEqual(sortObject(actualData), sortObject(expectedData))
		console.log('ok')
	}
	catch (err) {
		console.error(err)
		process.exit(-1)
	}
}

main()
