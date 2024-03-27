/** @type {import('ts-jest').JestConfigWithTsJest} */
module.exports = {
  preset: 'ts-jest',
  testEnvironment: 'node',
  testMatch: ["**/**/*.test.ts"],
  verbose: true,
  forceExit: true,
  moduleNameMapper: {
    '^@shared/(.*)$': '<rootDir>/src/shared/$1',
  }
  //clearMocks: true
};