module.exports = {
  modulePathIgnorePatterns: ['<rootDir>/node_modules/'],
  moduleFileExtensions: ['js', 'ts', 'jsx'],
  testEnvironment: 'jest-environment-jsdom-fourteen',
  testPathIgnorePatterns: ['/node_modules/'],
  transform: {
    "^.+\\.[t|j]sx?$": "ts-jest",
    "^.+\\.html?$": "html-loader-jest",
    "^.+\\.(en|cy|conf)?$": "./test/messageFormatJestTransformer.js",
  },
  moduleNameMapper: {
    '\\.s?css$': 'identity-obj-proxy'
  },
  coverageThreshold: {
    global: {
      "branches": 100,
      "functions": 100,
      "lines": 100,
      "statements": 100
    }
  }
}
