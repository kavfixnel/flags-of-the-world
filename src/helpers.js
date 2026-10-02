import { useState, useEffect, useRef, useCallback } from "react";

// Longer than the longest country name, so the hint can always reveal all of it
const MAX_PREFIX_LENGTH = 60;

const useFocus = () => {
  const htmlElRef = useRef(null);
  // Stable identity: callers list it as an effect dependency, and a fresh
  // function on every render would re-run those effects every render
  const setFocus = useCallback(() => {
    htmlElRef.current && htmlElRef.current.focus();
  }, []);

  return [htmlElRef, setFocus];
};

const usePersistedState = (defaultValue, storageKey) => {
  const [value, setValue] = useState(() => {
    // A key that holds something other than JSON (hand-edited, truncated, left
    // over from an older version of the game) used to throw here, which took
    // the whole app down with no way back other than clearing site data.
    try {
      const value = window.localStorage.getItem(storageKey);

      return value ? JSON.parse(value) : defaultValue;
    } catch {
      return defaultValue;
    }
  });

  useEffect(() => {
    // Writing can fail too, e.g. when the storage quota is exhausted or the
    // browser blocks storage. Losing the save is survivable, crashing is not.
    try {
      window.localStorage.setItem(storageKey, JSON.stringify(value));
    } catch {
      /* ignore */
    }
  }, [storageKey, value]);

  return [value, setValue];
};

// The number input hands back strings, and localStorage can hold anything a
// previous version of the game wrote there, so the prefix length is forced into
// a usable number at the one place that owns it.
const clampPrefixLength = (value) => {
  const length = Math.floor(Number(value));

  if (Number.isNaN(length)) return 0;

  return Math.min(Math.max(length, 0), MAX_PREFIX_LENGTH);
};

export { useFocus, usePersistedState, clampPrefixLength, MAX_PREFIX_LENGTH };
