module.exports = {
  testEnvironment: 'jsdom',  
  moduleNameMapper: {
      '\\.(css|less|scss|sass)$': '<rootDir>/jest.mock.js',
    },
  };
  