'use client';
import styles from './styles.module.scss'
import { useState } from "react";
import { useRouter } from "next/navigation";
import { useYear } from '../../HomeAuth/selectBox/yearProvider';

export default function CustomSelectBox() {
  const { selectedYear, onYearChange } = useYear();
  const router = useRouter();
  const [isOpen, setIsOpen] = useState(false);
  
  // Opções de séries
  const options = ["6º ano", "7º ano", "8º ano", "9º ano"];

  const handleSelect = (year: string) => {
    // Atualiza o contexto
    onYearChange(year);
    // Atualiza a URL com o novo parâmetro
    router.push(`/search?name=&serie=${encodeURIComponent(year)}`);
    // Fecha a lista de opções
    setIsOpen(false);
  };

  return (
    <div 
      className={styles.selectContainer} 
      onMouseEnter={() => setIsOpen(true)}
      onMouseLeave={() => setIsOpen(false)}
      onClick={() => setIsOpen(prev => !prev)}
    >
      <div className={styles.selectedValue}>
        {selectedYear}
      </div>
      {isOpen && (
        <ul className={styles.optionsList}>
          {options.map(option => (
            <li 
              key={option} 
              className={styles.optionItem} 
              onClick={(e) => {
                // Impede que o onClick do container seja disparado novamente
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
