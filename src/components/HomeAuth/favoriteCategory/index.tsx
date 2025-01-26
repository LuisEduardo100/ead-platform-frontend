'use client'
import useSWR from 'swr'
import PageSpinner from '../../common/pageSpinner'
import styles from './styles.module.scss'
import courseService, { CourseType } from '../../../services/courseService'
import SlideSection from '../../HomeNoAuth/slideSectionSelectedYear'
import { Container } from 'reactstrap'
import SlideSectionNoYear from '../../HomeNoAuth/slideSectionNoYear'
import { useYear } from '../selectBox/yearProvider'
import SlideComponentSearch from '../../common/SlideComponentSearch'
import { useState } from 'react'


export default function FavoriteCourses() {
  const { data, error } = useSWR("/favorites", courseService.getFavCourses);
  
  if (error) return error;
  if (!data) return (<PageSpinner />);
  return (
    <>
      <div style={{padding: '20px 50px'}}>
        <p className={styles.pStyle}>MINHA LISTA</p>
        {data?.data.courses?.length > 0 ? (
          <SlideComponentSearch course={data?.data.courses} />
        ) : (
          <div className="text-center py-3">
            <p className={styles.p}>Você não tem nenhum curso na lista.</p>
          </div>
        )}
      </div >
    </>
  );
}
