import type { Config } from '@jest/types';
// Sync object
const config: Config.InitialOptions = {
  preset: 'ts-jest',
  testEnvironment: 'node',
  verbose: true,
  transform: {
    '^.+\\.ts?$': 'ts-jest',
  },
  coverageDirectory: 'coverage/',
  testRegex: '(/test/integration/.*|(\\.|/)(test|spec))\\.[jt]s?$',
  setupFiles: ["./.jest/setEnvVars.ts"]
};
export default config;
