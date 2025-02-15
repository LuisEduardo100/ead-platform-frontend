'use client';
import React, { useState, useRef } from "react";
import styles from './styles.module.scss';

interface SeriesFilterProps {
  series: string[];                  // lista de séries disponíveis
  searchSeriesTerm: string;         // valor atual do filtro de séries
  setSearchSeriesTerm: React.Dispatch<React.SetStateAction<string>>;
}

const SeriesFilter: React.FC<SeriesFilterProps> = ({ series, searchSeriesTerm, setSearchSeriesTerm }) => {
  const [isOpen, setIsOpen] = useState(false);
  const closeTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  const handleMouseEnter = () => {
    if (closeTimeoutRef.current) {
      clearTimeout(closeTimeoutRef.current);
    }
    setIsOpen(true);
  };

  const handleMouseLeave = () => {
    closeTimeoutRef.current = setTimeout(() => {
      setIsOpen(false);
    }, 200);
  };

  const handleSelect = (serie: string) => {
    setSearchSeriesTerm(serie);
    setIsOpen(false);
  };

  const options = ["Todas as séries", ...series];

  return (
    <div
      className={styles.selectContainer}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      onClick={() => setIsOpen(prev => !prev)}
    >
      <div className={styles.selectedValue}>
        {searchSeriesTerm || "Todas as séries"}
      </div>
      {isOpen && (
        <ul className={styles.optionsList}>
          {options.map(option => (
            <li
              key={option}
              className={styles.optionItem}
              onClick={(e) => {
                e.stopPropagation();
                handleSelect(option);
              }}
            >
              {option}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default SeriesFilter;
