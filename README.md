# Is ServiceWorker Ready Yet?

Tracks the features of ServiceWorker supported in browsers.

TODO: link to spec
TODO: link to site

## Contribute

To update data, edit `data.json`, which is in this format:

```js
[
  {
    "name", "Feature name or <code>interface.whatever</code>",
    "description", "Brief feature details, html <strong>allowed</strong>",
    "chrome": {
      // 1 = supported
      // 0.5 = supported with caveats (eg flags, nightlies, special builds)
      // 0 = not supported
      "supported": 1
      // (optional) browser version
      "minVersion": 35,
      // (optional) alternate icon, currently supports:
      // "canary"
      // "firefox-nightly"
      "icon": "canary",
      // (optional) details, cavats, links to tickets, flags etc
      "details": [
        "Requires <a href=\"https://www.google.co.uk/intl/en/chrome/browser/canary.html\">Chrome Canary</a>"
      ]
    },
    "firefox": {},
    "opera": {},
    "safari": {},
    "ie": {}
  },
  // ...
]
```