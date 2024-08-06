'use client'

import useSWR from 'swr'
import PageSpinner from '../../common/pageSpinner'
import styles from './styles.module.scss'
import courseService from '../../../services/courseService'
import SlideSection from '../../HomeNoAuth/slideSection'
import { Container } from 'reactstrap'

export default function FavoriteCourses() {
  const { data, error } = useSWR("/favorites", courseService.getFavCourses);
  if (error) return error;
  if (!data) return (<><PageSpinner /></>);
  return (
    <>
      <Container>
        <p className={styles.pStyle}>MINHA LISTA</p>
        {data.data.courses.length >= 1 ? (
          <SlideSection newestCourses={data.data.courses} />
        ) : (
          <p className="h6 text-center pt-3">
            <p className={styles.p}>Você não tem nenhum curso na lista</p>
          </p>
        )}
      </Container>
    </>
  );
}
