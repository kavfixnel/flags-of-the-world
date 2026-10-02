import { useState, useEffect, useRef } from "react";

const useFocus = () => {
  const htmlElRef = useRef(null);
  const setFocus = () => {
    htmlElRef.current && htmlElRef.current.focus();
  };

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

export { useFocus, usePersistedState };
