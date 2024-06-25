import React, { useEffect, useState } from 'react'
import courseService, { CourseType } from '../../../services/courseService'
import SlideSection from '../slideSection';
import styles from './styles.module.scss'

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
    <p className={styles.pStyle}>MÓDULOS SOMA E MULTIPLICAÇÃO</p>
    <SlideSection newestCourses={newestCourse} />
  </>

  );
}

export default HomeSlide