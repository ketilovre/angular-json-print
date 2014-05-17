angular-json-print
==================

Angular directive to pretty-print and syntax-highlight JSON.

[![Build Status](https://travis-ci.org/ketilovre/angular-json-print.svg?branch=master)](https://travis-ci.org/ketilovre/angular-json-print)
[![Code Climate](https://codeclimate.com/github/ketilovre/angular-json-print.png)](https://codeclimate.com/github/ketilovre/angular-json-print)

##Usage

1. Include 'json-print' as a dependency for your app.

  `angular.module('myApp', ['json-print'])`

2. Add the directive `json-print` to an element, along with the data source
  ```html
    <pre json-print="{Obj|String}" json-indent="[Int]"></pre>
  ```
  *Note*: The use of an element like `<pre>` is required to preserve indentation and line breaks, but has no effect on highlighting.

#####Arguments

- `json-print` - Accepts either a regular JavaScript object, or a string of JSON.
- `json-indent` - *Optional* - Level of indentation, defaults to four spaces.

####Markup

Values, properties, braces and brackets are wrapped in `<span>`s with the following classes:

- Properties

  ```html
    <span class="json-print-prop">"foo"</span>:
  ```
- Strings. Any HTML-markup is escaped and displayed as text.

  ```html
    <span class="json-print-string">"String with <p>HTML</p>"</span>
  ```
- Numbers. Additional classes for zero, and positive and negative numbers.
  
  ```html
      <span class="json-print-number json-print-zero">0</span>
      <span class="json-print-number json-print-plus">1</span>
      <span class="json-print-number json-print-minus">-1</span>
  ```
  
- Booleans. Additional classes for true/false.

  ```html
    <span class="json-print-bool json-print-true">true</span>
    <span class="json-print-bool json-print-false">false</span>
  ```
  
- Null

  ```html
      <span class="json-print-null">null</span>
  ```
  
- Objects

  ```html
      <span class="json-print-object">{</span>
      <span class="json-print-object">}</span>
  ```

- Arrays

  ```html
      <span class="json-print-array">[</span>
      <span class="json-print-array">]</span>
  ```
