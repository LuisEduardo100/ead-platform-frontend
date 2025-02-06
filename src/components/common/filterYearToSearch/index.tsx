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

  // Quando o mouse entra no container, cancela qualquer timer de fechamento e abre o dropdown
  const handleMouseEnter = () => {
    if (closeTimeoutRef.current) {
      clearTimeout(closeTimeoutRef.current);
    }
    setIsOpen(true);
  };

  // Ao sair com o mouse, inicia um timer para fechar o dropdown após um pequeno atraso
  const handleMouseLeave = () => {
    closeTimeoutRef.current = setTimeout(() => {
      setIsOpen(false);
    }, 200); // 200ms de atraso (você pode ajustar esse valor conforme necessário)
  };

  return (
    <div 
      className={styles.selectContainer} 
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
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
                // Evita que o clique se propague para o container
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
