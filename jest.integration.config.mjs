import nextJest from 'next/jest.js';
import { TextEncoder, TextDecoder } from 'util';
import { Response } from 'node-fetch';

const createJestConfig = nextJest({
  dir: './',
});

class MockBroadcastChannel {
  constructor() {
    this.name = 'mock-broadcast-channel';
  }
  postMessage() {}
  close() {}
  addEventListener() {}
  removeEventListener() {}
}

const config = {
  testEnvironment: '@happy-dom/jest-environment',
  testMatch: ['<rootDir>/src/__tests__/integration/**/*.test.tsx'],
  setupFilesAfterEnv: ['<rootDir>/jest.setup.ts'],
  moduleNameMapper: {
    '^@/(.*)$': '<rootDir>/src/$1',
  },
  globals: {
    TextEncoder: TextEncoder,
    TextDecoder: TextDecoder,
    Response: Response,
    BroadcastChannel: MockBroadcastChannel,
  },
};

export default createJestConfig(config); 