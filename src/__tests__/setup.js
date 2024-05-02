import { afterAll, vi } from 'vitest';
import '@testing-library/jest-dom/vitest';
import { server } from './msw/server';
import "vitest-canvas-mock";

beforeAll(() => server.listen({ onUnhandledRequest: "bypass" }));
afterEach(() => server.resetHandlers());
afterAll(() => server.close());
