import { vi } from "vitest";

export function mockIntersectionObserver() {
  const intersectionObserverInstanceMock = {
      root: null,
      rootMargin: '',
      thresholds: [0],
      observe: vi.fn(),
      unobserve: vi.fn(),
      disconnect: vi.fn(),
      takeRecords: vi.fn(),
  };

  window.IntersectionObserver = vi.fn()
    .mockImplementation(
        (callback) => {
            callback([{isIntersecting: true}]);
            return intersectionObserverInstanceMock;
        },
    );

  return [ intersectionObserverInstanceMock, window.IntersectionObserver ];
}