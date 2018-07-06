/* eslint no-mixed-operators:0, no-console:0, max-params:0 */
'use strict'

const util = require('util')
const fsUtil = require('fs')
const fs = require('fs').promises
const fetch = require('node-fetch')
const mkdirp = require('mkdirp')
const pathUtil = require('path')
const extendr = require('extendr')

const homedir = `${process.env.HOME}/Documents/Cartera`
const cachedir = `${homedir}/cache`

const { Datetime, Currency } = require('./types')

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
	const today = new Datetime(now.getFullYear(), now.getMonth(), now.getDate(), now.getHours())
	return today
}

const nowDatetime = getNowish()

async function cache (url, test) {
	try {
		const hash = require('crypto').createHash('md5').update(url).digest('hex')
		const cachefile = `${cachedir}/${hash}`
		let exists = fsUtil.existsSync(cachefile)
		if (exists) {
			const text = await fs.readFile(cachefile)
			try {
				const data = JSON.parse(text)
				return data
			}
			catch (e) {
				await fs.unlink(cachefile)
				exists = false
			}
		}
		if (!exists) {
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
		return JSON.parse(data)
	}
	catch (e) {
		throw e
	}
}

async function fetchHistoricalData (currency, datetime, currencies) {
	try {
		const time = datetime.getTime()
		const timestamp = Math.round(time / 1000)
		const from = currency
		const to = currencies.join(',')
		const url = `https://min-api.cryptocompare.com/data/pricehistorical?fsym=${from}&tsyms=${to}&ts=${timestamp}`
		const data = await cache(url, (data) => data.Response !== 'Error')
		const market = data[currency]
		Object.keys(market).forEach(function (key) {
			market[key] = new Currency(market[key], key)
		})
		return market
	}
	catch (e) {
		throw e
	}
}

function checkAssets (assets, currencies) {
	if (!assets.totals) assets.totals = {}
	for (const group of Object.keys(assets)) {
		for (const currency of currencies) {
			if (assets[group][currency] == null) assets[group][currency] = new Currency(0.0, currency)
			if (assets[group][currency] < 0) {
				console.error(assets)
				throw new Error('asset became below zero, this should not occur: ' + assets[group][currency])
			}
		}
	}
}
function updateAssets (assets, currencies, entry = null) {
	if (entry) {
		const fromAccount = entry.from.account || 'unknown'
		const toAccount = entry.to.account || 'unknown'
		if (!assets[fromAccount]) assets[fromAccount] = {}
		if (!assets[toAccount]) assets[toAccount] = {}

		checkAssets(assets, currencies)

		if (entry.type === 'inward') {
			assets.totals[entry.to.currency] = assets.totals[entry.to.currency].add(entry.to.total)
			assets[toAccount][entry.to.currency] = assets[toAccount][entry.to.currency].add(entry.to.total)
		}
		else if (entry.type === 'outward') {
			assets.totals[entry.from.currency] = assets.totals[entry.from.currency].subtract(entry.from.total)
			assets[fromAccount][entry.from.currency] = assets[fromAccount][entry.from.currency].subtract(entry.from.total)
		}
		else if (entry.type === 'transfer') {
			assets.totals[entry.from.currency] = assets.totals[entry.from.currency].subtract(entry.from.total)
			assets.totals[entry.to.currency] = assets.totals[entry.to.currency].add(entry.to.total)
			assets[fromAccount][entry.from.currency] = assets[fromAccount][entry.from.currency].subtract(entry.from.total)
			assets[toAccount][entry.to.currency] = assets[toAccount][entry.to.currency].add(entry.to.total)
		}
		else {
			throw new Error('unknown transaction type')
		}

		checkAssets(assets, currencies)
	}
	else {
		checkAssets(assets, currencies)
	}
}

function updateAmounts (entry) {
	if (!entry.from.fee) entry.from.fee = new Currency(0.0, entry.from.currency)
	if (!entry.to.fee) entry.to.fee = new Currency(0.0, entry.to.currency)
	if (!entry.from.subtotal && entry.from.total) entry.from.subtotal = entry.from.total.subtract(entry.from.fee)
	if (!entry.to.subtotal && entry.to.total) entry.to.subtotal = entry.to.total.subtract(entry.to.fee)
	if (!entry.from.total && entry.from.subtotal) entry.from.total = entry.from.subtotal.add(entry.from.fee)
	if (!entry.to.total && entry.to.subtotal) entry.to.total = entry.to.subtotal.add(entry.to.fee)
}

async function fetchMarketInternal (datetime, currencies) {
	const market = {}
	await Promise.all(
		currencies.map(async function (currency) {
			const result = await fetchHistoricalData(currency, datetime, currencies)
			market[currency] = result
		})
	)
	return market
}

async function fetchMarket (markets, datetime, currencies) {
	const timestamp = datetime.toISOString()
	if (!markets[timestamp]) markets[timestamp] = fetchMarketInternal(datetime, currencies)
	const market = await markets[timestamp]
	return market
}

function computeDiscrepancy (quotedRate, actualRate, sold, bought) {
	const expectedBoughtAtQuotedRate = sold.multiply(quotedRate, bought.currency)
	const expectedSoldAtQuotedRate = bought.divide(quotedRate, sold.currency)
	const boughtHiddenFee = expectedBoughtAtQuotedRate.subtract(bought)
	const soldHiddenFee = sold.subtract(expectedSoldAtQuotedRate)
	return {
		quotedRate, actualRate, sold, bought, expectedBoughtAtQuotedRate, expectedSoldAtQuotedRate, boughtHiddenFee, soldHiddenFee
	}
}

function computeHolding (assets, market, datetime, last = null) {
	const holding = {
		when: datetime,
		assets: extendr.clone(assets),
		value: {}
	}
	if (last) {
		holding.change = {}
	}

	/*
	open.value = {}
	close.value = {}
	usedCurrencies.forEach(function (currency) {
		if (currency === open.bought.currency) {
			open.value[currency] = open.bought.subtotal
		}
		else if (currency === open.sold.currency) {
			open.value[currency] = open.sold.subtotal
		}
		else {
			open.value[currency] = open.sold.subtotal * open.market[open.sold.currency][currency]
		}

		if (currency === close.bought.currency) {
			close.value[currency] = close.bought.subtotal
		}
		else if (currency === close.sold.currency) {
			close.value[currency] = close.bought.subtotal * open.bought.price
		}
		else {
			close.value[currency] = close.bought.subtotal * open.market[close.bought.currency][currency]
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
	*/

	return holding
}

function log (data, output = 'user', logger = console.log) {
	if (output === 'json') {
		logger(JSON.stringify(data, null, '  '))
	}
	else if (output === 'user') {
		logger(util.inspect(data, { colors: true, depth: 10, compact: false }))
	}
}

async function main ({ path = `${homedir}/portfolio.json`, output = 'user', currency = 'USD' }) {
	let portfolio
	try {
		await mkdirp(cachedir)
		const keyCurrency = currency
		const usedCurrencyMap = {}
		usedCurrencyMap[keyCurrency] = true

		portfolio = await readPortfolio(pathUtil.resolve(process.cwd(), path))
		const markets = {}
		const assets = {}

		// autocomplete missing fields
		portfolio.transactions.forEach(function (entry) {
			if (!entry.when) throw new Error('transaction missing when')
			entry.when = new Datetime(entry.when)
			if (!entry.to && !entry.from) throw new Error('transaction must have a to or from')
			if (!entry.to) entry.to = { currency: entry.from.currency }
			if (!entry.from) entry.from = { currency: entry.to.currency }
			if (!entry.to.currency || !entry.from.currency) throw new Error('transaction missing both from and to currency')
			usedCurrencyMap[entry.from.currency] = true
			usedCurrencyMap[entry.to.currency] = true
			if (entry.to.rate) entry.to.rateType = 'manual'
			if (entry.from.rate) entry.from.rateType = 'manual'

			// currency
			if (entry.from.fee) entry.from.fee = new Currency(entry.from.fee, entry.from.currency)
			if (entry.to.fee) entry.to.fee = new Currency(entry.to.fee, entry.to.currency)
			if (entry.from.total) entry.from.total = new Currency(entry.from.total, entry.from.currency)
			if (entry.to.total) entry.to.total = new Currency(entry.to.total, entry.to.currency)
			if (entry.from.subtotal) entry.from.subtotal = new Currency(entry.from.subtotal, entry.from.currency)
			if (entry.to.subtotal) entry.to.subtotal = new Currency(entry.to.subtotal, entry.to.currency)
			if (entry.from.rate) entry.from.rate = new Currency(entry.from.rate, entry.from.currency)
			if (entry.to.rate) entry.to.rate = new Currency(entry.to.rate, entry.to.currency)
		})

		const usedCurrencies = Object.keys(usedCurrencyMap)
		updateAssets(assets, usedCurrencies)
		const nowMarket = await fetchMarket(markets, nowDatetime, usedCurrencies)

		let lastEntry = null
		for (const entry of portfolio.transactions) {
			// update
			updateAmounts(entry)
			const market = await fetchMarket(markets, entry.when, usedCurrencies)

			// autocomplete missing amounts using rate or market data
			if (!entry.from.subtotal) {
				if (!entry.to.total) {
					console.error(entry)
					throw new Error('transaction missing both from and to subtotal or total')
				}
				if (entry.to.currency === entry.from.currency) {
					entry.from.subtotal = entry.to.subtotal.subtract(entry.to.fee)
				}
				else {
					if (!entry.to.rate) {
						entry.to.rate = new Currency(market[entry.from.currency][entry.to.currency], entry.to.currency)
						entry.to.rateType = 'market'
					}
					entry.from.subtotal = entry.to.total.divide(entry.to.rate, entry.from.currency)
				}
			}
			if (!entry.to.subtotal) {
				if (entry.to.currency === entry.from.currency) {
					entry.to.subtotal = entry.from.total
				}
				else {
					if (!entry.to.rate) {
						entry.from.rate = market[entry.to.currency][entry.from.currency]
						entry.from.rateType = 'market'
					}
					entry.to.subtotal = entry.from.total.divide(entry.from.rate, entry.to.currency)
				}
			}
			updateAmounts(entry)


			// --------------------------------------------
			// format

			// rates
			const fromRate = entry.from.total.divide(entry.to.total, entry.from.currency)
			const toRate = entry.to.total.divide(entry.from.total, entry.to.currency)
			if (!entry.from.rate) {
				entry.from.rate = fromRate
				entry.from.rateType = 'computed'
			}
			if (!entry.to.rate) {
				entry.to.rate = toRate
				entry.to.rateType = 'computed'
			}
			if (entry.from.rate.notEqual(fromRate)) {
				entry.from.discrepancy = computeDiscrepancy(entry.from.rate, fromRate, entry.to.total, entry.from.total)
			}
			if (entry.to.rate.notEqual(toRate)) {
				entry.to.discrepancy = computeDiscrepancy(entry.to.rate, toRate, entry.from.total, entry.to.total)
			}

			// --------------------------------------------
			// holdings

			// open
			entry.open = computeHolding(assets, market, entry.when, lastEntry && lastEntry.close)

			// assets
			updateAssets(assets, usedCurrencies, entry)

			// close
			entry.close = computeHolding(assets, market, entry.when, entry.open)
			entry.now = computeHolding(assets, nowMarket, nowDatetime, entry.open)

			// last
			lastEntry = entry
		}
		log(portfolio, output)
		return portfolio
	}
	catch (e) {
		log(portfolio, output, console.error)
		throw e
	}
}

module.exports = main
