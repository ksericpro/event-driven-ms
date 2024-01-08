/** @type {import('ts-jest').JestConfigWithTsJest} */
module.exports = {
  "preset": 'ts-jest',
  "testEnvironment": 'node',
  "collectCoverage": true,
  "reporters": [
    "default",
    [
      "./node_modules/jest-html-reporter",
      {
        "pageTitle": "Test Report"
      }
    ]
  ],
  "testMatch": [
      "**/tests/unit/*.test.ts"
  ]
};