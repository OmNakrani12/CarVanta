import { beforeAll, afterEach, afterAll } from 'vitest';
import { server } from './mocks/server';
// Start MSW mock server before all tests
beforeAll(() => server.listen({ onUnhandledRequest: 'bypass' }));

// Reset handlers after each test (clean slate)
afterEach(() => server.resetHandlers());

// Close server after all tests are finished
afterAll(() => server.close());
