# iDAI.components 2
 
## Getting started

Clone this repository and run

```
npm install
npm run build
npm start (= npm run server)
```

The last command starts a webserver listening on http://localhost:8083.

## Demo

The demo app is used to display the functionality of the library.
It makes use of the configuration files at

```
demo/config
```

which will get automatically created from their template counterparts
by `npm run build` in case they don't exist.

## Testing


Unit test the library files with

```
$ npm test
```

E2E test the library by running the server, then opening another terminal and running

```
$ npm run e2e
```


## Using the library

SCSS files:

```
src/scss/idai-components-2.scss
```

Module exports, which can be used via systemjs:

```
configuration.ts
core.ts
datastore.ts
documents.ts
idai-field-map.ts
idai-field-model.ts
messages.ts
persist.ts
widgets.ts
```

## Publishing via NPM

To make sure the version number on github is not behind your
local version it is recommended to maintain the following order
of commands when publishing

```
git add . && git commit -m ""         # Commit your local changes
npm run build
npm version patch -m "New release %s" # which creates another commit
npm publish
git push
```



