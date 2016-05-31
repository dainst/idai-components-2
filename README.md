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
idai-comp`onents-2.ts
css/idai-components-2.css
``