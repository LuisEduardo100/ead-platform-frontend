'use client';
import React, { useState, useRef } from "react";
import styles from './styles.module.scss';
import { CategoryType } from "../../../services/categoriesService";

interface CategoryFilterProps {
  categories: CategoryType[];
  searchCategoryTerm: string;
  setSearchCategoryTerm: React.Dispatch<React.SetStateAction<string>>;
}

const CategoryFilter: React.FC<CategoryFilterProps> = ({ categories, searchCategoryTerm, setSearchCategoryTerm }) => {
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

  const handleSelect = (category: string) => {
    setSearchCategoryTerm(category);
    setIsOpen(false);
  };

  // As opções: a primeira é fixa e depois as categorias
  const options = ["Todas as matérias", ...categories.map((cat) => cat.name)];

  return (
    <div
      className={styles.selectContainer}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      onClick={() => setIsOpen(prev => !prev)}
    >
      <div className={styles.selectedValue}>
        {searchCategoryTerm || "Todas as matérias"}
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

export default CategoryFilter;
