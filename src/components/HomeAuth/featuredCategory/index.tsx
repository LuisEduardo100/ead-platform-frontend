'use client'
import useSWR from 'swr'
import styles from './styles.module.scss'
import courseService, { CourseType } from '../../../services/courseService'
import PageSpinner from '../../common/pageSpinner'
import { useYear } from '../selectBox/yearProvider'
import SlideComponentSearch from '../../common/SlideComponentSearch'
import { useEffect, useState } from 'react'

export default function FeaturedCategory() {
    const [loading, setLoading] = useState(true)
    const { selectedYear, onYearChange } = useYear()
    const { data, error } = useSWR("/featured", courseService.getFeaturedCourses)
    const filteredCourses = data?.data?.filter((course: CourseType) => course.serie === selectedYear);

    useEffect(() => {
        if (filteredCourses?.length > 0) setLoading(false)
    }, [filteredCourses])

    if (error) return error
    if (!data || loading) return <PageSpinner />
    return (<>
        <div style={{padding: '20px 50px'}}>
            <p className={styles.pStyle}>DESTAQUE</p>
            <SlideComponentSearch course={filteredCourses} />
        </div>
    </>)
}