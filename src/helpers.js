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
    const value = window.localStorage.getItem(storageKey);

    return value ? JSON.parse(value) : defaultValue;
  });

  useEffect(() => {
    window.localStorage.setItem(storageKey, JSON.stringify(value));
  }, [storageKey, value]);

  return [value, setValue];
};

export { useFocus, usePersistedState };
