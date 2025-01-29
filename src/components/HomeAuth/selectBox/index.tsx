import profileService from '../../../services/profileService';
import PageSpinner from '../../common/pageSpinner';
import styles from './styles.module.scss'
import { ChangeEvent, useEffect, useState } from 'react';

const YearSelect = ({ selectedYear, onYearChange }: { selectedYear: string, onYearChange: (year: string) => void }) => {

  const [loading, setLoading] = useState(true);

  const fetchUserData = async () => {
    try {
      const data = await profileService.fetchCurrent();
      if (data?.serie) {
        onYearChange(data.serie);
      }
    } catch (error) {
      console.error("Erro ao buscar os dados do usuário:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (event: ChangeEvent<HTMLSelectElement>) => {
    onYearChange(event.target.value);
  };

  useEffect(() => {
    fetchUserData()
  }, []) // tirei o fetchUserData do []


  if (loading) {
    return <PageSpinner />
  }
  return (
    <div className={styles.selectBoxContainer}>
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
