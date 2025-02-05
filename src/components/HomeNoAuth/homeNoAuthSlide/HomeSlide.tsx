import React from 'react'
import courseService from '../../../services/courseService'
import PageSpinner from '../../common/pageSpinner';
import useSWR from 'swr';
import SlideComponentNoAuth from '../sliderAutoplay/SlideComponent';
import SlideComponentSearch from '../../common/SlideComponentSearch';

const HomeSlide = () => {
  const { data, error } = useSWR('/newest', courseService.getNewestCourses)

  if (error) return error
  if (!data) return <PageSpinner />
  return (<>
  <div style={{padding: '0px 50px'}}>
    <p style={{textAlign: 'center', fontSize: '1.5rem'}}>Confira os cursos em destaque</p>
      <SlideComponentSearch course={data.data} />
  </div>
  </>)
}

export default HomeSlide