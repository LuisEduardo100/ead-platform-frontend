import React, { useEffect, useState } from 'react'
import courseService, { CourseType } from '../../../services/courseService'
import SlideSection from '../slideSection';
import styles from './styles.module.scss'
import { Container } from 'reactstrap';
import PageSpinner from '../../common/pageSpinner';
import useSWR from 'swr';

const HomeSlide = () => {
  const { data, error } = useSWR('/newest', courseService.getNewestCourses)

  if (error) return error
  if (!data) return <PageSpinner />
  return (<>
      <Container>
          <p className={styles.pStyle}>LANÇAMENTOS</p>
          <SlideSection newestCourses={data.data} />
      </Container>
  </>)
}

export default HomeSlide