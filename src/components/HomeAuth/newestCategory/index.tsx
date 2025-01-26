'use client'
import useSWR from "swr";
import PageSpinner from "../../common/pageSpinner";
import courseService, { CourseType } from "../../../services/courseService";
import SlideSection from "../../HomeNoAuth/slideSectionSelectedYear";
import styles from './styles.module.scss'
import { Container } from "reactstrap";
import SlideComponentSearch from "../../common/SlideComponentSearch";
import { useYear } from "../selectBox/yearProvider";
import SlideComponent from "../../common/SlideComponent";
import { useEffect, useState } from "react";
export default function NewestCategory() {
    const [loading, setLoading] = useState(true)
    const { selectedYear, onYearChange } = useYear()
    const { data, error } = useSWR('/newest', courseService.getNewestCourses)
    const filteredCourses = data?.data?.filter((course: CourseType) => course.serie === selectedYear);

    useEffect(() => {
        if (selectedYear) setLoading(false)
    }, [selectedYear])

    if (error) return error
    if (!data || loading) return <PageSpinner />
    return (<>
        <div style={{padding: '20px 50px'}}>
            <p className={styles.pStyle}>LANÇAMENTOS</p>
            <SlideComponentSearch course={filteredCourses} />
        </div >
    </>)
}