'use client'
import useSWR from "swr";
import PageSpinner from "../../common/pageSpinner";
import courseService from "../../../services/courseService";
import SlideSection from "../../HomeNoAuth/slideSection";
import styles from './styles.module.scss'
import { Container } from "reactstrap";
export default function NewestCategory({ selectedYear }: { selectedYear: string }) {
    const { data, error } = useSWR('/newest', courseService.getNewestCourses)

    if (error) return error
    if (!data) return <PageSpinner />
    return (<>
        <Container>
            <p className={styles.pStyle}>LANÇAMENTOS</p>
            <SlideSection newestCourses={data.data} selectedYear={selectedYear}/>
        </Container>
    </>)
}