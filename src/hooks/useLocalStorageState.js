import { useEffect, useState } from "react";

export function useLocalStorageState(key) {
  const [value, setValue] = useState(() => {
    const storedValue = JSON.parse(localStorage.getItem(key));
    return storedValue ? storedValue : [];
  });

  useEffect(() => {
    localStorage.setItem(key, JSON.stringify([...value]));
  }, [value, key]);

  return [value, setValue];
}
