module.exports = wallaby => ({
  files: [
    'src/**/*.js*',
    { pattern: 'babel.config.js', instrument: false },
    '!src/**/__tests__/*.js*',
  ],
  tests: ['src/**/__tests__/*.js*'],
  compilers: {
    'src/**/*.js*': wallaby.compilers.babel(),
  },
  env: {
    type: 'node',
    runner: 'node',
  },
  testFramework: 'jest',
});
