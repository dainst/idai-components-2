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
npm test
```

E2E test the library by running the server, then opening another terminal and running

```
npm run e2e
```


## Publishing

Adjust the exports in [idai-components-2.ts](idai-components-2.ts).

## Using the library

```
idai-components-2.ts <- the module exports, which you can use via system.js
lib/css/idai-components-2.css <- for your index.html
lib/templates <- these must be copied to your application so that they again remain at lib/templates
```
