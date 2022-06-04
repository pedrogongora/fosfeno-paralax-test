#!/usr/bin/env bash
rm -rf node_modules/
rm dist/bundle.js
npm install
npx webpack --watch
