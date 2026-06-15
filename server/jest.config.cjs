/* eslint-disable @typescript-eslint/no-require-imports, no-undef */
const { createDefaultPreset } = require("ts-jest");

const tsJestTransformCfg = createDefaultPreset().transform;

/** @type {import("jest").Config} **/
module.exports = {
  testEnvironment: "node",
  transform: {
    ...tsJestTransformCfg,
  },
  // so that import can use .js
  moduleNameMapper: {
    "^(\\.{1,2}/.*)\\.js$": "$1"
  }
};