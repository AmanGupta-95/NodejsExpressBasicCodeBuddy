import { createDefaultPreset } from 'ts-jest';

const tsJestTransformCfg = createDefaultPreset().transform;

/** @type {import("jest").Config} **/
export default {
  testEnvironment: 'node',
  moduleFileExtensions: ['ts', 'tsx', 'js', 'jsx', 'json', 'node'],
  testMatch: [
    '**/__tests__/**/*.+(ts|tsx|js)',
    '**/?(*.)+(spec|test).+(ts|tsx|js)',
  ],
  roots: ['<rootDir>/src'],
  coverageProvider: 'v8',
  clearMocks: true,
  moduleDirectories: ['node_modules', 'src'],
  transform: {
    ...tsJestTransformCfg,
  },
};
