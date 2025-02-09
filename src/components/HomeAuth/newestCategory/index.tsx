'use client'
import useSWR from "swr";
import PageSpinner from "../../common/pageSpinner";
import courseService, { CourseType } from "../../../services/courseService";
import styles from './styles.module.scss'
import SlideComponentSearch from "../../common/SlideComponentSearch";
import { useYear } from "../selectBox/yearProvider";
import { useEffect, useState } from "react";
export default function NewestCategory() {
    const [loading, setLoading] = useState(true)
    const { selectedYear, onYearChange } = useYear()
    const { data, error } = useSWR('/newest', courseService.getNewestCourses)
    const filteredCourses = data?.data?.filter((course: CourseType) => course.serie === selectedYear);

    useEffect(() => {
        if (filteredCourses?.length > 0) setLoading(false)
    }, [filteredCourses])

    if (error) return error
    if (!data || loading) return <PageSpinner />
    return (<>
        <div style={{padding: '20px 50px'}}>
            <p className={styles.pStyle}>LANÇAMENTOS</p>
            <SlideComponentSearch course={filteredCourses} />
        </div >
    </>)
}