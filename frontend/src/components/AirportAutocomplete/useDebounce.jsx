import { useState, useEffect } from 'react';

function useDebounce(value, delay) {
  // 用於儲存 debounce 後的值的 state
  const [debouncedValue, setDebouncedValue] = useState(value);

  useEffect(() => {
    // 設定一個計時器，在指定的 delay 時間後更新 debounce 後的值
    const handler = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    // 清理函式：在下一次 effect 執行前或元件卸載時，清除上一個計時器。
    // 這是 debounce 的核心，可以防止在 value 快速變化時更新 state。
    return () => {
      clearTimeout(handler);
    };
  }, [value, delay]); // 只有當 value 或 delay 改變時，才重新執行 effect

  return debouncedValue;
}

export default useDebounce;