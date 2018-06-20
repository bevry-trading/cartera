#!/usr/bin/env node
'use strict'

const cartera = require('./')

async function main () {
	try {
		const opts = {}
		const pathIndex = process.argv.indexOf('--path')
		if (pathIndex !== -1) {
			opts.path = process.argv[pathIndex + 1]
		}
		const currencyIndex = process.argv.indexOf('--currency')
		if (currencyIndex !== -1) {
			opts.currency = process.argv[currencyIndex + 1].toUpperCase()
		}
		opts.output = process.argv.indexOf('--json') === -1 ? 'user' : 'json'
		return await cartera(opts)
	}
	catch (err) {
		console.error(err)
		process.exit(-1)
	}
}

module.exports = main()
