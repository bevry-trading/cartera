/* eslint no-mixed-operators:0, no-console:0, max-params:0 */
'use strict'

const fsUtil = require('fs')
const fs = require('fs').promises
const fetch = require('node-fetch')
const mkdirp = require('mkdirp')
const pathUtil = require('path')
const { isDate } = require('typechecker')

const defaultCurrency = 'USD'
const homedir = `${process.env.HOME}/Documents/Cartera`
const cachedir = `${homedir}/cache`

mkdirp.sync(cachedir)

function flatten (arr) {
	return [].concat(...arr)
}

function uniq (arr) {
	return Array.from(new Set(
		flatten(arr)
	))
}

function getNowish () {
	const now = new Date()
	const today = new Date(now.getFullYear(), now.getMonth(), now.getDate(), now.getHours())
	return today
}

const now = getNowish()

async function cache (url, test) {
	try {
		const hash = require('crypto').createHash('md5').update(url).digest('hex')
		const cachefile = `${cachedir}/${hash}`
		const exists = fsUtil.existsSync(cachefile)
		if (exists) {
			const text = await fs.readFile(cachefile)
			const data = JSON.parse(text)
			return data
		}
		else {
			const data = await fetch(url).then((res) => res.json())
			const text = JSON.stringify(data, null, '  ')
			if (test(data) !== true) {
				throw new Error(`test failed for ${url} with data: ${text}`)
			}
			await fs.writeFile(cachefile, text)
			return data
		}
	}
	catch (e) {
		throw e
	}
}

async function readPortfolio (path) {
	try {
		const data = await fs.readFile(path)
		return JSON.parse(data).portfolio
	}
	catch (e) {
		throw e
	}
}

function getDate (datetime) {
	if (datetime) {
		if (isDate(datetime)) {
			return datetime
		}
		else {
			return new Date(datetime)
		}
	}
	else {
		return new Date(now)
	}
}

function getTimestamp (datetime) {
	const time = getDate(datetime).getTime()
	const timestamp = Math.round(time / 1000)
	return timestamp
}

function getWhen (datetime, output) {
	if (output === 'user') {
		return getDate(datetime).toLocaleString()
	}
	else {
		return getDate(datetime).toISOString()
	}
}

async function fetchHistoricalData (currency, datetime, currencies) {
	try {
		const timestamp = getTimestamp(datetime)
		const from = currency
		const to = currencies.join(',')
		const url = `https://min-api.cryptocompare.com/data/pricehistorical?fsym=${from}&tsyms=${to}&ts=${timestamp}`
		const data = await cache(url, (data) => data.Response !== 'Error')
		const market = data[currency]
		if (!market) {
			console.log('data:', data)
		}
		return market
	}
	catch (e) {
		throw e
	}
}

function getAmount (amount, decimals, output) {
	const result = Number(amount)
	if (output === 'user') {
		return Number(result.toFixed(decimals))
	}
	else {
		return result
	}
}

function getCurrency (amount, currency, output) {
	if (output === 'user' && currency === 'USD') {
		const result = getAmount(amount, 2, output)
		if (result < 0) {
			return '-$' + (result * -1)
		}
		else {
			return '$' + result
		}
	}
	else {
		return getAmount(amount, null, output)
	}
}

function getPercent (amount, output) {
	const result = getAmount(amount * 100.00, 2, output)
	if (output === 'user') {
		return result + '%'
	}
	else {
		return result
	}
}

async function main ({ path = `${homedir}/portfolio.json`, output = 'user' }) {
	try {
		const entries = await readPortfolio(pathUtil.resolve(process.cwd(), path))
		const totals = {
			currency: defaultCurrency,
			open: 0.00,
			close: 0.00,
			change: 0.00,
			difference: 0.00,
			remaining: 0.00
		}
		const items = await Promise.all(
			entries.map(async function (entry) {
				const holdingCurrency = entry.currency
				if (!holdingCurrency) {
					throw new Error('entries require currency field')
				}

				const open = entry.open
				open.when = new Date(open.when)
				if (!open.bought) open.bought = {}
				if (!open.sold) open.sold = {}
				if (!open.bought.currency) open.bought.currency = holdingCurrency
				if (!open.sold.currency) open.sold.currency = defaultCurrency
				if (!open.bought.amount && !open.sold.amount) {
					throw new Error('entries require a bought or sold amount')
				}

				const close = entry.close || {}
				if (!close.when) close.when = new Date(now)
				if (!close.bought) close.bought = {}
				if (!close.sold) close.sold = {}
				if (!close.bought.currency) close.bought.currency = open.sold.currency
				if (!close.sold.currency) close.sold.currency = open.bought.currency

				const usedCurrencies = uniq([defaultCurrency, open.sold.currency, open.bought.currency, close.sold.currency, close.bought.currency])

				open.market = {}
				// open.market[open.bought.currency] = await fetchHistoricalData(open.bought.currency, open.when, usedCurrencies)
				// open.market[open.sold.currency] = await fetchHistoricalData(open.sold.currency, open.when, usedCurrencies)
				await Promise.all(usedCurrencies.map(async function (currency) {
					open.market[currency] = await fetchHistoricalData(currency, open.when, usedCurrencies)
				}))

				if (!open.sold.amount) open.sold.amount = open.bought.amount * open.market[open.bought.currency][open.sold.currency]
				if (!open.bought.amount) open.bought.amount = open.sold.amount * open.market[open.sold.currency][open.bought.currency]

				if (!open.sold.price) open.sold.price = open.sold.amount / open.bought.amount
				if (!open.bought.price) open.bought.price = open.bought.amount / open.sold.amount

				close.market = {}
				// close.market[close.bought.currency] = await fetchHistoricalData(close.bought.currency, close.when, usedCurrencies)
				// close.market[close.sold.currency] = await fetchHistoricalData(close.sold.currency, close.when, usedCurrencies)
				await Promise.all(usedCurrencies.map(async function (currency) {
					close.market[currency] = await fetchHistoricalData(currency, close.when, usedCurrencies)
				}))

				if (!close.sold.amount) close.sold.amount = open.bought.amount
				if (!close.bought.amount) close.bought.amount = close.sold.amount * close.market[close.sold.currency][close.bought.currency]

				if (!close.sold.price) close.sold.price = close.sold.amount / close.bought.amount
				if (!close.bought.price) close.bought.price = close.bought.amount / close.sold.amount

				open.value = {}
				close.value = {}
				usedCurrencies.forEach(function (currency) {
					if (currency === open.bought.currency) {
						open.value[currency] = open.bought.amount
					}
					else if (currency === open.sold.currency) {
						open.value[currency] = open.sold.amount
					}
					else {
						open.value[currency] = open.sold.amount * open.market[open.sold.currency][currency]
					}

					if (currency === close.bought.currency) {
						close.value[currency] = close.bought.amount
					}
					else if (currency === close.sold.currency) {
						close.value[currency] = close.bought.amount * open.bought.price
					}
					else {
						close.value[currency] = close.bought.amount * open.market[close.bought.currency][currency]
					}
				})

				const changes = close.changes = {}
				usedCurrencies.forEach(function (currency) {
					const amount = close.value[currency] - open.value[currency]
					const difference = amount / open.value[currency]
					const remaining = close.value[currency] / open.value[currency]
					changes[currency] = {
						amount,
						difference: getPercent(difference, output),
						remaining: getPercent(remaining, output)
					}
				})

				if (!entry.close) entry.now = close

				open.when = getWhen(open.when, output)
				close.when = getWhen(close.when, output)

				totals.open += open.value[defaultCurrency]
				totals.close += close.value[defaultCurrency]
				totals.change += close.changes[defaultCurrency].amount

				return entry
			})
		)

		totals.difference = getPercent(totals.change / totals.open, output)
		totals.remaining = getPercent(totals.close / totals.open, output)
		totals.open = getCurrency(totals.open, totals.currency, output)
		totals.close = getCurrency(totals.close, totals.currency, output)
		totals.change = getCurrency(totals.change, totals.currency, output)

		const result = { items, totals }

		if (output === 'json') {
			console.log(JSON.stringify(result, null, '  '))
		}
		else if (output === 'user') {
			console.log(require('util').inspect(result, { colors: true, depth: 10, compact: false }))
		}

		return result
	}
	catch (e) {
		throw e
	}
}

module.exports = main
