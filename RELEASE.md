# Release

To create a new Visual Studio Code extension release, you typically need to follow these steps:

* Compile the TypeScript code.
* Package the extension.
* Publish the extension.

## Checklist

* Verify first if pre-release or release version!
* Update README, CHANGELOG
* Check package & package.lock for having correct version number
* Update message for release in `src/config/releaseMessages.conf.ts`
* Execute building steps according to your release

## Execute

### Release version

Run `npm run release` or manually:

Compile the TypeScript code: `npm run compile`

Package the extension: `npm run package`

Publish the extension: `npm run publish`

### Pre-release

If you are creating a pre-release version, you can use the following commands instead:

Run `npm run pre-release` or manually:

Compile the TypeScript code: `npm run compile`

Package the extension as a pre-release: `npm run package:preRelease`

Publish the extension as a pre-release: `npm run publish:preRelease`

These commands will compile your code, package it into a .vsix file, and then publish it to the Visual Studio Code Marketplace.
