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

Cartera takes an input json file, otherwise at `~/Documents/Cartera/portfolio.json` that contains your investment portfolio in the format of:

``` json
{
  "portfolio": [
    {
      "currency": "BCH",
      "amount": 2,
      "purchased": "2017-08-01"
    },
    {
      "currency": "ETH",
      "amount": 2,
      "purchased": "2017-08-01"
    }
  ]
}
```

And produces a result like:

``` js
[
  {
    currency: 'BCH',
    amount: 2,
    purchased: {
      BCH: 1,
      USD: 439.27,
      BTC: 0.1608,
      EUR: 374.43,
      AUD: 600.98,
      when: 1501545600
    },
    current: {
      BCH: 1,
      USD: 1149.06,
      BTC: 0.1508,
      EUR: 979.98,
      AUD: 1499.71,
      when: 1528274584
    },
    change: {
      currency: 'USD',
      amount: 709.79,
      percent: 61.77,
      profit: true
    },
    profit: {
      currency: 'USD',
      amount: 123.54,
      profit: true
    }
  },
  {
    currency: 'ETH',
    amount: 2,
    purchased: {
      ETH: 1,
      USD: 225.9,
      BTC: 0.08285,
      EUR: 192.9,
      AUD: 309.65,
      when: 1501545600
    },
    current: {
      ETH: 1,
      USD: 606.84,
      BTC: 0.07984,
      EUR: 518.85,
      AUD: 794.01,
      when: 1528274584
    },
    change: {
      currency: 'USD',
      amount: 380.94,
      percent: 62.77,
      profit: true
    },
    profit: {
      currency: 'USD',
      amount: 125.55,
      profit: true
    }
  }
]
```

Proudly powered by https://cryptocompare.com

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
