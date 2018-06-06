/* eslint no-mixed-operators:0 no-console:0 */
'use strict'

const fs = require('fs').promises
const fetch = require('node-fetch')

const fiatCurrencies = ['USD', 'EUR', 'AUD']
const defaultCryptoCurrency = 'BTC'
const defaultFiatCurrency = 'USD'

function flatten (arr) {
	return [].concat(...arr)
}

function uniq (arr) {
	return Array.from(new Set(
		flatten(arr)
	))
}

async function readPortfolio () {
	try {
		const data = await fs.readFile(process.argv[2] || `${process.env.HOME}/Documents/Cartera/portfolio.json`)
		return JSON.parse(data).portfolio
	}
	catch (e) {
		throw e
	}
}

async function fetchHistoricalData (currency, datetime) {
	try {
		const time = (datetime && new Date(datetime) || new Date()).getTime()
		const timestamp = Math.round(time / 1000)
		const from = currency
		const to = uniq([currency, defaultFiatCurrency, defaultCryptoCurrency, fiatCurrencies]).join(',')
		const url = `https://min-api.cryptocompare.com/data/pricehistorical?fsym=${from}&tsyms=${to}&ts=${timestamp}`
		const data = await fetch(url).then((res) => res.json())
		const result = data[currency]
		if (!result) {
			console.log(data)
		}
		result.when = timestamp
		return result
	}
	catch (e) {
		throw e
	}
}

async function main () {
	try {
		const portfolio = await readPortfolio()
		await Promise.all(
			portfolio.map(async function (entry) {
				const isFiat = fiatCurrencies.indexOf(entry.currency) !== -1
				const cryptoCurrency = isFiat ? defaultCryptoCurrency : entry.currency
				const fiatCurrency = isFiat ? entry.currency : defaultFiatCurrency

				entry.purchased = await fetchHistoricalData(cryptoCurrency, entry.purchased)
				entry.current = await fetchHistoricalData(cryptoCurrency)
				if (entry.sold) {
					entry.sold = await fetchHistoricalData(cryptoCurrency, entry.sold)
				}

				const amount = isFiat ? (entry.amount / entry.purchased[fiatCurrency]) : entry.amount
				if (isFiat) {
					entry.from = {
						currency: entry.currency,
						amount: entry.amount
					}
					entry.currency = cryptoCurrency
					entry.amount = amount
				}

				const latest = entry.sold || entry.current

				const changeAmount = latest[fiatCurrency] - entry.purchased[fiatCurrency]
				const changePercent = ((changeAmount / latest[fiatCurrency]) * 100)

				entry.change = {
					currency: fiatCurrency,
					amount: Number(changeAmount.toFixed(2)),
					percent: Number(changePercent.toFixed(2)),
					profit: changeAmount > 0
				}

				const profitAmount = amount * changePercent
				entry.profit = {
					currency: fiatCurrency,
					amount: Number(profitAmount.toFixed(2)),
					profit: profitAmount > 0
				}
			})
		)
		console.log(require('util').inspect(portfolio, { colors: true, depth: 10, compact: false }))
	}
	catch (e) {
		throw e
	}
}

main()
