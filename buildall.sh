#!/usr/bin/env bash
cd ../fosfeno-local
npm run build
cd ../paralax-test
rm -rf node_modules/
rm dist/bundle.js
npm install
npx webpack --watch
