import styles from './styles.module.scss'
import { ChangeEvent, useState } from 'react';

const YearSelect = ({ selectedYear, onYearChange }: { selectedYear: string, onYearChange: (year: string) => void }) => {

  const handleChange = (event: ChangeEvent<HTMLSelectElement>) => {
    onYearChange(event.target.value);  // Chama a função para atualizar o estado do ano no componente pai
  };

  return (
    <div className={styles.selectBoxContainer}>
      <label className={styles.label} htmlFor="yearSelect">Selecione o ano:</label>
      <select
        id="yearSelect"
        value={selectedYear}
        onChange={handleChange}
        className={styles.selectBox}
      >
        <option value="6º ano">6º ano</option>
        <option value="7º ano">7º ano</option>
        <option value="8º ano">8º ano</option>
        <option value="9º ano">9º ano</option>
      </select>
    </div>
  );
};

export default YearSelect;
