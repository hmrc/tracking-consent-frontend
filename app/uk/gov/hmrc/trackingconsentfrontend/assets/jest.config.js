module.exports = {
  modulePathIgnorePatterns: ['<rootDir>/node_modules/'],
  moduleFileExtensions: ['js', 'ts', 'jsx'],
  testEnvironment: 'jest-environment-jsdom-fourteen',
  testPathIgnorePatterns: ['/node_modules/'],
  transform: {
    "^.+\\.[t|j]sx?$": "ts-jest",
    "^.+\\.html?$": "html-loader-jest"
  },
  moduleNameMapper: {
    '\\.s?css$': 'identity-obj-proxy'
  },
  coverageThreshold: {
    global: {
      "branches": 80,
      "functions": 80,
      "lines": 80,
      "statements": 80
    }
  }
}
