<!-- TITLE/ -->

<h1>cartera</h1>

<!-- /TITLE -->


<!-- BADGES/ -->

<span class="badge-travisci"><a href="http://travis-ci.org/bevry-trading/cartera" title="Check this project's build status on TravisCI"><img src="https://img.shields.io/travis/bevry-trading/cartera/master.svg" alt="Travis CI Build Status" /></a></span>
<span class="badge-npmversion"><a href="https://npmjs.org/package/cartera" title="View this project on NPM"><img src="https://img.shields.io/npm/v/cartera.svg" alt="NPM version" /></a></span>
<span class="badge-npmdownloads"><a href="https://npmjs.org/package/cartera" title="View this project on NPM"><img src="https://img.shields.io/npm/dm/cartera.svg" alt="NPM downloads" /></a></span>
<span class="badge-daviddm"><a href="https://david-dm.org/bevry-trading/cartera" title="View the status of this project's dependencies on DavidDM"><img src="https://img.shields.io/david/bevry-trading/cartera.svg" alt="Dependency Status" /></a></span>
<span class="badge-daviddmdev"><a href="https://david-dm.org/bevry-trading/cartera#info=devDependencies" title="View the status of this project's development dependencies on DavidDM"><img src="https://img.shields.io/david/dev/bevry-trading/cartera.svg" alt="Dev Dependency Status" /></a></span>
<br class="badge-separator" />
<span class="badge-patreon"><a href="https://patreon.com/bevry" title="Donate to this project using Patreon"><img src="https://img.shields.io/badge/patreon-donate-yellow.svg" alt="Patreon donate button" /></a></span>
<span class="badge-opencollective"><a href="https://opencollective.com/bevry" title="Donate to this project using Open Collective"><img src="https://img.shields.io/badge/open%20collective-donate-yellow.svg" alt="Open Collective donate button" /></a></span>
<span class="badge-flattr"><a href="https://flattr.com/profile/balupton" title="Donate to this project using Flattr"><img src="https://img.shields.io/badge/flattr-donate-yellow.svg" alt="Flattr donate button" /></a></span>
<span class="badge-paypal"><a href="https://bevry.me/paypal" title="Donate to this project using Paypal"><img src="https://img.shields.io/badge/paypal-donate-yellow.svg" alt="PayPal donate button" /></a></span>
<span class="badge-bitcoin"><a href="https://bevry.me/bitcoin" title="Donate once-off to this project using Bitcoin"><img src="https://img.shields.io/badge/bitcoin-donate-yellow.svg" alt="Bitcoin donate button" /></a></span>
<span class="badge-wishlist"><a href="https://bevry.me/wishlist" title="Buy an item on our wishlist for us"><img src="https://img.shields.io/badge/wishlist-donate-yellow.svg" alt="Wishlist browse button" /></a></span>
<br class="badge-separator" />
<span class="badge-slackin"><a href="https://slack.bevry.me" title="Join this project's slack community"><img src="https://slack.bevry.me/badge.svg" alt="Slack community badge" /></a></span>

<!-- /BADGES -->


> `cartera` is `portfolio` in [Catalan](https://en.wikipedia.org/wiki/Catalan_language)

<!-- DESCRIPTION/ -->

investment portfolio

<!-- /DESCRIPTION -->


<!-- INSTALL/ -->

<h2>Install</h2>

<a href="https://npmjs.com" title="npm is a package manager for javascript"><h3>NPM</h3></a><ul>
<li>Install: <code>npm install --global cartera</code></li>
<li>Executable: <code>cartera</code></li></ul>

<h3><a href="https://github.com/bevry/editions" title="Editions are the best way to produce and consume packages you care about.">Editions</a></h3>

<p>This package is published with the following editions:</p>

<ul><li><code>cartera</code> aliases <code>cartera/source/index.js</code></li>
<li><code>cartera/source/index.js</code> is Source + <a href="https://babeljs.io/docs/learn-es2015/" title="ECMAScript Next">ESNext</a> + <a href="https://nodejs.org/dist/latest-v5.x/docs/api/modules.html" title="Node/CJS Modules">Require</a></li></ul>

<p>Older environments may need <a href="https://babeljs.io/docs/usage/polyfill/" title="A polyfill that emulates missing ECMAScript environment features">Babel's Polyfill</a> or something similar.</p>

<!-- /INSTALL -->


## Usage

Cartera portfolios are JSON files like this:

``` json
{
  "portfolio": [
    {
      "currency": "BCH",
      "open": {
        "when": "2017-08-01",
        "bought": {
          "amount": 2
        }
      },
      "close": {
        "when": "2018-06-20T05:00:00.000Z"
      }
    },
    {
      "currency": "ETH",
      "open": {
        "when": "2017-08-01",
        "bought": {
          "amount": 2
        }
      },
      "close": {
        "when": "2018-06-20T05:00:00.000Z"
      }
    }
  ]
}
```

By default the portfolio is located at `~/Documents/Cartera/portfolio.json` however you can specify a custom path via `cartera --path <path/file.json>`

Running cartera will output a result like this:

``` js
{
  items: [
    {
      currency: 'BCH',
      open: {
        when: '8/1/2017, 8:00:00 AM',
        bought: {
          amount: 2,
          currency: 'BCH',
          price: 0.002276504200150249
        },
        sold: {
          currency: 'USD',
          amount: 878.54,
          price: 439.27
        },
        market: {
          USD: {
            USD: 1,
            BCH: 0.002277
          },
          BCH: {
            USD: 439.27,
            BCH: 1
          }
        },
        value: {
          USD: 878.54,
          BCH: 2
        }
      },
      close: {
        when: '6/20/2018, 1:00:00 PM',
        bought: {
          currency: 'USD',
          amount: 1800.34,
          price: 900.17
        },
        sold: {
          currency: 'BCH',
          amount: 2,
          price: 0.0011109012742037616
        },
        market: {
          USD: {
            USD: 1,
            BCH: 0.001111
          },
          BCH: {
            USD: 900.17,
            BCH: 1
          }
        },
        value: {
          USD: 1800.34,
          BCH: 4.0984815716985
        },
        changes: {
          USD: {
            amount: 921.8,
            difference: '104.92%',
            remaining: '204.92%'
          },
          BCH: {
            amount: 2.0984815716984997,
            difference: '104.92%',
            remaining: '204.92%'
          }
        }
      }
    },
    {
      currency: 'ETH',
      open: {
        when: '8/1/2017, 8:00:00 AM',
        bought: {
          amount: 2,
          currency: 'ETH',
          price: 0.004426737494466578
        },
        sold: {
          currency: 'USD',
          amount: 451.8,
          price: 225.9
        },
        market: {
          ETH: {
            USD: 225.9,
            ETH: 1
          },
          USD: {
            USD: 1,
            ETH: 0.004427
          }
        },
        value: {
          USD: 451.8,
          ETH: 2
        }
      },
      close: {
        when: '6/20/2018, 1:00:00 PM',
        bought: {
          currency: 'USD',
          amount: 1072.38,
          price: 536.19
        },
        sold: {
          currency: 'ETH',
          amount: 2,
          price: 0.0018650105373095357
        },
        market: {
          ETH: {
            USD: 536.19,
            ETH: 1
          },
          USD: {
            USD: 1,
            ETH: 0.001865
          }
        },
        value: {
          USD: 1072.38,
          ETH: 4.74714475431607
        },
        changes: {
          USD: {
            amount: 620.5800000000002,
            difference: '137.36%',
            remaining: '237.36%'
          },
          ETH: {
            amount: 2.7471447543160696,
            difference: '137.36%',
            remaining: '237.36%'
          }
        }
      }
    }
  ],
  totals: {
    currency: 'USD',
    open: '$1330.34',
    close: '$2872.72',
    change: '$1542.38',
    difference: '115.94%',
    remaining: '215.94%'
  }
}
```

And can generate JSON output by using the `--json` flag:

``` json
{
  "items": [
    {
      "currency": "BCH",
      "open": {
        "when": "2017-08-01T00:00:00.000Z",
        "bought": {
          "amount": 2,
          "currency": "BCH",
          "price": 0.002276504200150249
        },
        "sold": {
          "currency": "USD",
          "amount": 878.54,
          "price": 439.27
        },
        "market": {
          "USD": {
            "USD": 1,
            "BCH": 0.002277
          },
          "BCH": {
            "USD": 439.27,
            "BCH": 1
          }
        },
        "value": {
          "USD": 878.54,
          "BCH": 2
        }
      },
      "close": {
        "when": "2018-06-20T05:00:00.000Z",
        "bought": {
          "currency": "USD",
          "amount": 1800.34,
          "price": 900.17
        },
        "sold": {
          "currency": "BCH",
          "amount": 2,
          "price": 0.0011109012742037616
        },
        "market": {
          "USD": {
            "USD": 1,
            "BCH": 0.001111
          },
          "BCH": {
            "USD": 900.17,
            "BCH": 1
          }
        },
        "value": {
          "USD": 1800.34,
          "BCH": 4.0984815716985
        },
        "changes": {
          "USD": {
            "amount": 921.8,
            "difference": 104.92407858492498,
            "remaining": 204.92407858492498
          },
          "BCH": {
            "amount": 2.0984815716984997,
            "difference": 104.92407858492498,
            "remaining": 204.92407858492498
          }
        }
      }
    },
    {
      "currency": "ETH",
      "open": {
        "when": "2017-08-01T00:00:00.000Z",
        "bought": {
          "amount": 2,
          "currency": "ETH",
          "price": 0.004426737494466578
        },
        "sold": {
          "currency": "USD",
          "amount": 451.8,
          "price": 225.9
        },
        "market": {
          "USD": {
            "USD": 1,
            "ETH": 0.004427
          },
          "ETH": {
            "USD": 225.9,
            "ETH": 1
          }
        },
        "value": {
          "USD": 451.8,
          "ETH": 2
        }
      },
      "close": {
        "when": "2018-06-20T05:00:00.000Z",
        "bought": {
          "currency": "USD",
          "amount": 1072.38,
          "price": 536.19
        },
        "sold": {
          "currency": "ETH",
          "amount": 2,
          "price": 0.0018650105373095357
        },
        "market": {
          "USD": {
            "USD": 1,
            "ETH": 0.001865
          },
          "ETH": {
            "USD": 536.19,
            "ETH": 1
          }
        },
        "value": {
          "USD": 1072.38,
          "ETH": 4.74714475431607
        },
        "changes": {
          "USD": {
            "amount": 620.5800000000002,
            "difference": 137.35723771580348,
            "remaining": 237.35723771580348
          },
          "ETH": {
            "amount": 2.7471447543160696,
            "difference": 137.35723771580348,
            "remaining": 237.35723771580348
          }
        }
      }
    }
  ],
  "totals": {
    "currency": "USD",
    "open": 1330.34,
    "close": 2872.7200000000003,
    "change": 1542.38,
    "difference": 115.93878256686263,
    "remaining": 215.93878256686264
  }
}
```


<!-- HISTORY/ -->

<h2>History</h2>

<a href="https://github.com/bevry-trading/cartera/blob/master/HISTORY.md#files">Discover the release history by heading on over to the <code>HISTORY.md</code> file.</a>

<!-- /HISTORY -->


<!-- CONTRIBUTE/ -->

<h2>Contribute</h2>

<a href="https://github.com/bevry-trading/cartera/blob/master/CONTRIBUTING.md#files">Discover how you can contribute by heading on over to the <code>CONTRIBUTING.md</code> file.</a>

<!-- /CONTRIBUTE -->


<!-- BACKERS/ -->

<h2>Backers</h2>

<h3>Maintainers</h3>

No maintainers yet! Will you be the first?

<h3>Sponsors</h3>

No sponsors yet! Will you be the first?

<span class="badge-patreon"><a href="https://patreon.com/bevry" title="Donate to this project using Patreon"><img src="https://img.shields.io/badge/patreon-donate-yellow.svg" alt="Patreon donate button" /></a></span>
<span class="badge-opencollective"><a href="https://opencollective.com/bevry" title="Donate to this project using Open Collective"><img src="https://img.shields.io/badge/open%20collective-donate-yellow.svg" alt="Open Collective donate button" /></a></span>
<span class="badge-flattr"><a href="https://flattr.com/profile/balupton" title="Donate to this project using Flattr"><img src="https://img.shields.io/badge/flattr-donate-yellow.svg" alt="Flattr donate button" /></a></span>
<span class="badge-paypal"><a href="https://bevry.me/paypal" title="Donate to this project using Paypal"><img src="https://img.shields.io/badge/paypal-donate-yellow.svg" alt="PayPal donate button" /></a></span>
<span class="badge-bitcoin"><a href="https://bevry.me/bitcoin" title="Donate once-off to this project using Bitcoin"><img src="https://img.shields.io/badge/bitcoin-donate-yellow.svg" alt="Bitcoin donate button" /></a></span>
<span class="badge-wishlist"><a href="https://bevry.me/wishlist" title="Buy an item on our wishlist for us"><img src="https://img.shields.io/badge/wishlist-donate-yellow.svg" alt="Wishlist browse button" /></a></span>

<h3>Contributors</h3>

These amazing people have contributed code to this project:

<ul><li><a href="http://balupton.com">Benjamin Lupton</a> — <a href="https://github.com/bevry-trading/cartera/commits?author=balupton" title="View the GitHub contributions of Benjamin Lupton on repository bevry-trading/cartera">view contributions</a></li></ul>

<a href="https://github.com/bevry-trading/cartera/blob/master/CONTRIBUTING.md#files">Discover how you can contribute by heading on over to the <code>CONTRIBUTING.md</code> file.</a>

<!-- /BACKERS -->


<!-- LICENSE/ -->

<h2>License</h2>

Unless stated otherwise all works are:

<ul><li>Copyright &copy; <a href="http://balupton.com">Benjamin Lupton</a></li></ul>

and licensed under:

<ul><li><a href="http://spdx.org/licenses/MIT.html">MIT License</a></li></ul>

<!-- /LICENSE -->
