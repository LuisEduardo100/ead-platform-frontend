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
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const data = await profileService.fetchCurrent();

        if (data?.serie) {
          onYearChange(data.serie);
        }
      } catch (error) {
        console.error("Erro ao buscar os dados do usuário:", error);
      } finally {
        setLoading(false)
      }
    }

    fetchUserData()
  })

  if (loading) {
    return <PageSpinner />
  }
  return (
    <div className={styles.selectBoxContainer}>
      <div className={styles.selectedOption}>{selectedYear}</div>
      {showDropdown && (
        <ul className={styles.dropdownMenu}>
          {["6º ano", "7º ano", "8º ano", "9º ano"].map((year) => (
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
