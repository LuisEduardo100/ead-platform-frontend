import profileService from '../../../services/profileService';
import PageSpinner from '../../common/pageSpinner';
import styles from './styles.module.scss'
import { ChangeEvent, useEffect, useRef, useState } from 'react';

const YearSelect = ({
  selectedYear,
  onYearChange,
  showDropdown,
}: {
  selectedYear: string,
  onYearChange: (year: string) => void,
  showDropdown: boolean,
}) => {
  return (
    <div className={styles.selectBoxContainer}>
      <div className={styles.selectedOption}>{selectedYear}</div>
      {showDropdown && (
        <ul className={styles.dropdownMenu}>
          {["6º ano", "7º ano", "8º ano", "9º ano", "1º ano", "2º ano", "3º ano"].map((year) => (
            <li key={year} className={styles.dropdownItem} onClick={() => onYearChange(year)}>
              {year}
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}

export default YearSelect;
