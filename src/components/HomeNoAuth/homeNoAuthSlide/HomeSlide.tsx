import React, { useEffect, useState } from 'react'
import courseService, { CourseType } from '../../../services/courseService'
import SlideSection from '../slideSection';
import styles from './styles.module.scss'
import { Container } from 'reactstrap';

const HomeSlide = () => {
  const [newestCourse, setNewestCourses] = useState<CourseType[]>([]);

  const fetchCourses = async () => {
    const courses = await courseService.getNewestCourses();
    setNewestCourses(courses.data);
  };
  useEffect(() => {
    fetchCourses();
  }, [newestCourse]);

  return (<>
    <Container>
      <p className={styles.pStyle}>LANÇAMENTOS</p>
      <SlideSection newestCourses={newestCourse} />
    </Container>
  </>

  );
}

export default HomeSlide