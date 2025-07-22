/* eslint-disable @typescript-eslint/no-explicit-any */
import { useState } from "react";

export const useLocalStorage = (key: string, initialValue: any) => {
  const [value, setValue] = useState(() => {
    const stored = localStorage.getItem(key);
    return stored ? stored : initialValue;
  });

  const setStoredValue = (newValue: any) => {
    setValue(newValue);
    localStorage.setItem(key, newValue);
  };

  return [value, setStoredValue] as const;
};
