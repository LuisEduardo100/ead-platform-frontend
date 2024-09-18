import React from 'react'
import courseService from '../../../services/courseService'
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