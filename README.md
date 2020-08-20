# iDAI.components 2
 
## Getting started

Clone this repository and run

```
npm install
npm run build
```


## Testing


Unit test the library files with

```
$ npm test
```


## Publishing via NPM

A npm account (which could be signed up here: https://www.npmjs.com/signup) and 
the user rights on this npm package are required.
To make sure the version number on github is not behind your
local version it is recommended to maintain the following order
of commands when publishing

```
git add . && git commit -m ""         # Commit your local changes
npm login
npm run build
npm version patch -m "New release %s" # which creates another commit
npm publish
git push
```
