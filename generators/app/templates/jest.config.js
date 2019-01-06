module.exports = {
  transform: {
    '^.+\\.(js|jsx)$': 'babel-jest',
  },
  setupFiles: ['./test-setup.js'],
};
