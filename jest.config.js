module.exports = {
  modulePathIgnorePatterns: ['<rootDir>/node_modules/'],
  testEnvironmentOptions: {
    url: 'https://www.tax.service.example.com/some-service/some-page'
  },
  moduleFileExtensions: ['js', 'ts'],
  testPathIgnorePatterns: ['/js/node_modules/'],
  testEnvironment: 'jsdom',
  testRunner: 'jest-jasmine2',
  transform: {
    '^.+\\.html?$': 'jest-html-loader',
    '^.+\\.(en|cy|conf)?$': './js/test/messageFormatJestTransformer.js',
  },
  moduleNameMapper: {
    '\\.s?css$': 'identity-obj-proxy',
  },
  coverageThreshold: {
    global: {
      branches: 100,
      functions: 100,
      lines: 100,
      statements: 100,
    },
  },
};
