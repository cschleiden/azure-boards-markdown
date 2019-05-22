# Azure Boards Markdown #



## Building ##

This extension uses *webpack* for bundling, *webpack-dev-server* for watching files and serving bundles during development, *mocha*, *chai* for writing unit tests, and *karma* as a test runner.

Two bundles are defined for webpack, one for the main dialog, one for the extension context menu registration. 

All actions can be triggered using npm scripts (`npm run <target>`), no additional task runner required.  

### General setup ###

You need

* node/npm

then just clone and execute `npm install`.

### Development ###

1. Run `npm run publish:dev` to publish the current extension manifest to the marketplace as a private extension with a suffix of `-dev` added to the extension id. This package will use a baseUri of `https://localhost:8080`. 

2. Run `npm run dev` to start a webpack developmen server that watches all source files. Tests live next to product code and use a `.tests.ts` suffix instead of only `.ts`.

3. To run a single test pass execute `npm run test`, to keep watching tests and build/execute as you develop execute `npm run dev:test`.

### Production ###

 1. Run `npm run publish:release` to compile all modules into bundles, package them into a .vsix, and publish as a *public* extension to the VSTS marketplace.
