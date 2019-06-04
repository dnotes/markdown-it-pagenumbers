![build](https://travis-ci.org/dnotes/markdown-it-base.svg?branch=master)
[![Coverage Status](https://coveralls.io/repos/github/dnotes/markdown-it-base/badge.svg?branch=master)](https://coveralls.io/github/dnotes/markdown-it-base?branch=master)

# Page numbers in Markdown

This markdown-it plugin parses page numbers in the format `[pg #]` and renders them as anchors in the form of `<a data-pg="#">#</a>`.

## Installation

`yarn add markdown-it-pagenumbers`

## Usage

``` javascript
let md = require('markdown-it')().use(require('markdown-it-macron-underline'))
md.render('This is [pg 1] a paragraph.')
```
