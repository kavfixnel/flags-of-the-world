import { renderHook, act } from "@testing-library/react";

import { clampPrefixLength, usePersistedState, MAX_PREFIX_LENGTH } from "./helpers";

describe("clampPrefixLength", () => {
  it("turns what the number input returns into a number", () => {
    expect(clampPrefixLength("3")).toBe(3);
    expect(clampPrefixLength(3)).toBe(3);
  });

  it("falls back to zero for values that are not numbers", () => {
    expect(clampPrefixLength("")).toBe(0);
    expect(clampPrefixLength("abc")).toBe(0);
    expect(clampPrefixLength(undefined)).toBe(0);
  });

  it("keeps the value in range", () => {
    expect(clampPrefixLength(-5)).toBe(0);
    expect(clampPrefixLength(MAX_PREFIX_LENGTH + 10)).toBe(MAX_PREFIX_LENGTH);
    expect(clampPrefixLength(2.7)).toBe(2);
  });
});

describe("usePersistedState", () => {
  beforeEach(() => window.localStorage.clear());

  it("reads a previously stored value", () => {
    window.localStorage.setItem("k", JSON.stringify({ a: 1 }));

    const { result } = renderHook(() => usePersistedState(null, "k"));

    expect(result.current[0]).toEqual({ a: 1 });
  });

  it("writes changes back to localStorage", () => {
    const { result } = renderHook(() => usePersistedState(0, "k"));

    act(() => result.current[1](7));

    expect(window.localStorage.getItem("k")).toBe("7");
  });

  it("falls back to the default when the stored value is not JSON", () => {
    window.localStorage.setItem("k", "[{broken json");

    const { result } = renderHook(() => usePersistedState("fallback", "k"));

    expect(result.current[0]).toBe("fallback");
  });

  it("survives localStorage refusing to store anything", () => {
    const setItem = jest
      .spyOn(Storage.prototype, "setItem")
      .mockImplementation(() => {
        throw new Error("QuotaExceededError");
      });

    const { result } = renderHook(() => usePersistedState(0, "k"));

    expect(() => act(() => result.current[1](1))).not.toThrow();
    expect(result.current[0]).toBe(1);

    setItem.mockRestore();
  });
});
