'use client';
import { useState, useRef } from "react";
import { useRouter } from "next/navigation";
import styles from "./styles.module.scss";
import { useYear } from "../../HomeAuth/selectBox/yearProvider";

export default function CustomSelectBox() {
  const { selectedYear, onYearChange } = useYear();
  const router = useRouter();
  const [isOpen, setIsOpen] = useState(false);
  const closeTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  const options = ["6º ano", "7º ano", "8º ano", "9º ano"];

  const handleSelect = (year: string) => {
    onYearChange(year);
    router.push(`/search?name=&serie=${encodeURIComponent(year)}`);
    setIsOpen(false);
  };

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

  return (
    <div 
      className={styles.selectContainer} 
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      onClick={() => setIsOpen(prev => !prev)}
    >
      <div className={styles.selectedValue}>
        {selectedYear || "Todas as séries"}
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
}
