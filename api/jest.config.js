/** @type {import('ts-jest').JestConfigWithTsJest} */
const { pathsToModuleNameMapper } = require('ts-jest')
const tsconfig = require('./tsconfig.json')

module.exports = {
  preset: 'ts-jest',
  testEnvironment: 'node',
  transform: {
    '^.+\\.tsx?$': 'ts-jest'
  },
  modulePaths: [tsconfig.compilerOptions.baseUrl],
  moduleNameMapper: pathsToModuleNameMapper(tsconfig.compilerOptions.paths)
}
