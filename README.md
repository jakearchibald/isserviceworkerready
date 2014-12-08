# Is ServiceWorker Ready Yet?

Tracks the features of ServiceWorker supported in browsers. [View the site](https://jakearchibald.github.io/isserviceworkerready).

## Run locally

To install, run the following in the root of your cloned copy of the repo:

```sh
npm install
```

To serve the site on `localhost:3000`:

```sh
npm run serve
```

To build the site:

```sh
npm run build
```

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
      // "webkit-nightly"
      // "opera-developer"
      "icon": "canary",
      // (optional) details, cavats, links to tickets, flags etc
      "details": [
        "Requires <a href=\"https://www.google.co.uk/intl/en/chrome/browser/canary.html\">Chrome Canary</a>"
      ]
    },
    "firefox": {},
    "opera": {},
    "safari": {},
    "ie": {},
    // (optional) details that don't apply to a single browser
    "details": [
      "<strong>Chrome & Firefox</strong>: sitting in a tree K-I-S-S-I-N-G"
    ]
  },
  // ...
]
```
