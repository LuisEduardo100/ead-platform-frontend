'use client'
import useSWR from 'swr'
import PageSpinner from '../../common/pageSpinner'
import styles from './styles.module.scss'
import courseService from '../../../services/courseService'
import SlideSection from '../../HomeNoAuth/slideSectionSelectedYear'
import { Container } from 'reactstrap'
import SlideSectionNoYear from '../../HomeNoAuth/slideSectionNoYear'


export default function FavoriteCourses({ selectedYear }: { selectedYear: string }) {
  const { data, error } = useSWR("/favorites", courseService.getFavCourses);
  console.log(data)
  if (error) return error;
  if (!data) return (<><PageSpinner /></>);
  return (
    <>
      <Container>
        <p className={styles.pStyle}>MINHA LISTA</p>
        {data?.data.courses?.length > 0 ? (
          <SlideSectionNoYear newestCourses={data?.data.courses} />
        ) : (
          <div className="text-center py-3">
            <p className={styles.p}>Você não tem nenhum curso na lista.</p>
          </div>
        )}
      </Container>
    </>
  );
}
