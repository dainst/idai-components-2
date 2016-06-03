# iDAI.components 2

## Getting started

Clone this repository and run

```
npm install
cd config
cp Configuration.json.template Configuration.json
cd ..
npm run build
npm run server
```

The last command starts a webserver listening on http://localhost:8083.

## Development

```
app - the demo application
lib - the library files
```

When opening http://localhost:8083 in a browser, you will see a link
to the object edit demo. Click it to open the demo.

## Publishing

Edit the exports in [idai-components-2.ts](idai-components-2.ts).

Create js and css files by

```
npm run build
```

Test the library files with

```
npm test
```

Commit all files including the js and css files and push them to github and release
a new version.

## Using the library

```
lib/idai-components-2.ts <- the module exports, which you can use via system.js
lib/css/idai-components-2.css <- for your index.html
lib/templates <- these must be copied to your application so that they again remain at lib/templates
``