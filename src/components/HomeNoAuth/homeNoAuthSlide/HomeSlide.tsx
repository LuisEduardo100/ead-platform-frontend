import React, { useEffect, useState } from 'react'
import courseService, { CourseType } from '../../../services/courseService'
import SlideSection from '../slideSection';
import styles from './styles.module.scss'
import { Container } from 'reactstrap';
import PageSpinner from '../../common/pageSpinner';
import useSWR from 'swr';
import SlideComponentNoAuth from '../sliderAutoplay/SlideComponent';

const HomeSlide = () => {
  const { data, error } = useSWR('/newest', courseService.getNewestCourses)

  if (error) return error
  if (!data) return <PageSpinner />
  return (<>
    <SlideComponentNoAuth course={data.data} />
  </>)
}

export default HomeSlide