// frontend/src/components/AirportAutocomplete.js

import React, { useState, useEffect, useRef } from 'react';
import useDebounce from './useDebounce';
import './AirportAutocomplete.css';

const AirportAutocomplete = ({ airports, value, onSelect, placeholder, id }) => {
  // `value` 是傳入的 IATA code, e.g., 'JFK'
  // `onSelect` 是選中機場後要執行的回呼函式

  const [inputValue, setInputValue] = useState(''); // input 中顯示的文字
  const [suggestions, setSuggestions] = useState([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [activeSuggestionIndex, setActiveSuggestionIndex] = useState(-1); // 用於鍵盤導航
  const wrapperRef = useRef(null); // 用來偵測點擊外部區域
  const suggestionsListRef = useRef(null); // 建議列表的 ref，用於滾動
  const debouncedQuery = useDebounce(inputValue, 100); // 2. 將輸入值進行 debounce，延遲 100ms

  // 當外部傳入的 value (IATA code) 改變時，更新 input 框內顯示的文字
  // 這個 Effect 現在只在 `value` 有值 (即已選中) 時才更新輸入框，避免覆蓋使用者正在輸入的內容
  useEffect(() => {
    if (value) {
      const selectedAirport = airports.find(a => a.iata_code === value);
      if (selectedAirport) {
        const displayValue = `${selectedAirport.airport_name} (${selectedAirport.iata_code})`;
        // 避免不必要的更新
        if (inputValue !== displayValue) {
          setInputValue(displayValue);
        }
      }
    }
  }, [value, airports, inputValue]);

  // 處理點擊組件外部時，關閉建議列表
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (wrapperRef.current && !wrapperRef.current.contains(event.target)) {
        setShowSuggestions(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  // 處理鍵盤導航時，自動滾動到作用中的項目
  useEffect(() => {
    if (activeSuggestionIndex < 0 || !suggestionsListRef.current) {
      return;
    }
    const activeItem = suggestionsListRef.current.children[activeSuggestionIndex];
    if (activeItem) {
      activeItem.scrollIntoView({
        behavior: 'smooth',
        block: 'nearest',
      });
    }
  }, [activeSuggestionIndex]);

  // 3. 建立新的 Effect，當 debouncedQuery 改變時執行搜尋
  useEffect(() => {
    // 關鍵條件：只有當使用者正在輸入 (父組件的 value 為空) 且有查詢內容時才搜尋
    if (!value && debouncedQuery.length > 0) {
      const lowerQuery = debouncedQuery.toLowerCase();
      let filteredSuggestions;

      // 當輸入長度達到 3 時，切換到更精準的搜尋
      if (debouncedQuery.length >= 3) {
        // 精準搜尋：IATA code 完全匹配，或名稱/城市/國家開頭匹配
        filteredSuggestions = airports.filter(airport =>
            airport.iata_code.toLowerCase() === lowerQuery ||
            airport.airport_name.toLowerCase().startsWith(lowerQuery) ||
            (airport.city_name && airport.city_name.toLowerCase().startsWith(lowerQuery)) ||
            (airport.country_name && airport.country_name.toLowerCase().startsWith(lowerQuery))
        );
      } else {
        // 模糊搜尋 (少於 3 個字元)：只要任何欄位包含輸入的文字即可
        filteredSuggestions = airports.filter(airport =>
            airport.airport_name.toLowerCase().includes(lowerQuery) ||
            airport.iata_code.toLowerCase().includes(lowerQuery) ||
            (airport.city_name && airport.city_name.toLowerCase().includes(lowerQuery)) ||
            (airport.country_name && airport.country_name.toLowerCase().includes(lowerQuery))
        );
      }
      setSuggestions(filteredSuggestions.slice(0, 100));
      setShowSuggestions(true);
      setActiveSuggestionIndex(-1); // 每次建議更新時，重置作用中索引
    } else {
      setShowSuggestions(false);
    }
  }, [debouncedQuery, airports, value]); // 依賴 debouncedQuery 和 value

  // 4. 簡化 handleInputChange，只負責更新 state 和通知父組件
  const handleInputChange = (e) => {
    setInputValue(e.target.value);
    onSelect(''); // 清除父組件的選中狀態，這會讓 `value` prop 變為空，觸發搜尋 Effect 的條件
};

const handleSuggestionClick = (airport) => {
    onSelect(airport.iata_code);
    setShowSuggestions(false);
    setActiveSuggestionIndex(-1);
};

const handleKeyDown = (e) => {
    // 如果建議列表未顯示，或沒有建議項，則不進行任何操作
    if (!showSuggestions || suggestions.length === 0) {
      return;
    }

    switch (e.key) {
      case 'Enter':
        if (activeSuggestionIndex > -1) {
          e.preventDefault(); // 防止觸發表單提交
          handleSuggestionClick(suggestions[activeSuggestionIndex]);
        }
        break;
      case 'ArrowUp':
        e.preventDefault(); // 防止游標移動到文字開頭
        setActiveSuggestionIndex(prev => (prev <= 0 ? suggestions.length - 1 : prev - 1));
        break;
      case 'ArrowDown':
        e.preventDefault(); // 防止游標移動到文字結尾
        setActiveSuggestionIndex(prev => (prev + 1) % suggestions.length);
        break;
      case 'Escape':
        setShowSuggestions(false);
        break;
      default:
        break;
    }
};

  // 用於將匹配的文字進行醒目提示的輔助函式
  const getHighlightedText = (text, highlight) => {
    // 如果沒有文字或高亮關鍵字，直接返回原始文字
    if (!text || !highlight.trim()) {
      return <span>{text}</span>;
    }

    // 使用正則表達式進行不區分大小寫的匹配，並分割字串
    // 括號 () 讓分隔符 (匹配的文字) 也被保留在陣列中
    const regex = new RegExp(`(${highlight})`, 'gi');
    const parts = text.split(regex);

    return (
      <span>
        {parts.map((part, i) =>
          // 如果部分文字與高亮關鍵字匹配(忽略大小寫)，則應用高亮樣式
          part.toLowerCase() === highlight.toLowerCase()
            ? <span key={i} className="highlight">{part}</span>
            : <span key={i}>{part}</span>
        )}
      </span>
    );
  };

  return (
    <div className="autocomplete-wrapper" ref={wrapperRef}>
      <input
        id={id}
        type="text"
        value={inputValue}
        onChange={handleInputChange}
        onKeyDown={handleKeyDown}
        onFocus={() => { if (inputValue.length > 0 && !value && suggestions.length > 0) setShowSuggestions(true); }}
        placeholder={placeholder}
        autoComplete="off" // 關閉瀏覽器預設的自動完成
      />
     {showSuggestions && suggestions.length > 0 && (
        <ul className="suggestions-list" ref={suggestionsListRef}>
          {/* 全新的、資訊更豐富的列表項 */}
          {suggestions.map((airport, index) => (
            <li
              key={airport.iata_code}
              onClick={() => handleSuggestionClick(airport)}
              onMouseEnter={() => setActiveSuggestionIndex(index)}
              className={index === activeSuggestionIndex ? 'suggestion-active' : ''}
            >
              <div className="suggestion-main">
                <span className="suggestion-name">{getHighlightedText(airport.airport_name, inputValue)}</span>
                {/* 顯示城市和國家，提供更多上下文 */}
                <span className="suggestion-location">
                  {getHighlightedText(airport.city_name || 'N/A', inputValue)}, {getHighlightedText(airport.country_name || 'N/A', inputValue)}
                </span>
              </div>
              <div className="suggestion-iata">{getHighlightedText(airport.iata_code, inputValue)}</div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default AirportAutocomplete;