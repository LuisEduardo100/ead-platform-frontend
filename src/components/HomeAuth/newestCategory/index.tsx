'use client'
import useSWR from "swr";
import PageSpinner from "../../common/pageSpinner";
import courseService from "../../../services/courseService";
import SlideSection from "../../HomeNoAuth/slideSection";
import styles from './styles.module.scss'
export default function NewestCategory() {
    const { data, error } = useSWR('/newest', courseService.getNewestCourses)

    if (error) return error
    if (!data) return <PageSpinner />
    return (<>
        <p className={styles.pStyle}>LANÇAMENTOS</p>
        <SlideSection newestCourses={data.data}/>
    </>)
}