const { getDefaultConfig } = require('expo/metro-config');

/** @type {import('expo/metro-config').MetroConfig} */
const config = getDefaultConfig(__dirname);

// Workaround for TerminalReporter subpath resolution errors
config.resolver.unstable_enablePackageExports = false;

module.exports = config;