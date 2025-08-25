#!/bin/bash
#
# Generate API documentation
#
# Prerequisites:
# JSDoc 3 [https://github.com/jsdoc3/jsdoc]
# jaguar.js [http://jaguarjs.com/doc/]
#

# Ejecute
./node_modules/.bin/jsdoc src/ -r -p -P package.json -R README.md -t jaguarjs/docs/templates/jaguar/ -d api_docs


