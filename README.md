# pre-release - pre-alpha - untested
---
# PaySimple community library for Node.js

Pull requests welcome. Please write tests and ensure the
PR conforms to the JSCS and JSHint standards.

```bash
npm run jscs
npm run jshint
```

# Usage


```javascript
var PaySimple = require('paysimple');
var pay = new PaySimple({ accessid: 'kasjdflkasjd', key: '023i49sdfkl32' });

pay.setDevmode(); // to use the sandbox endpoint

```

## Debugging the library and HTTP traffic

Running with the environment variable `DEBUG=pay*` will print the HTTP
requests and responses.

For example, if your application is `app.js`:
```bash
DEBUG=pay* node app.js
```


# Testing

```bash
cp test/credentials.example.json test/credentials.json
```

Then add your credentials to `./test/credentials.json`.
This file is excluded from source control.

## Running the tests

```bash
npm run unit
npm run functional
npm test # everything
```

## Debugging the tests

Run with `DEBUG=pay*` environment variable.

```bash
DEBUG=pay* npm test
```
