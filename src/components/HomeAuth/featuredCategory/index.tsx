'use client'
import useSWR from 'swr'
import styles from './styles.module.scss'
import courseService from '../../../services/courseService'
import PageSpinner from '../../common/pageSpinner'
import SlideSection from '../../HomeNoAuth/slideSection'
import { Container } from 'reactstrap'

export default function FeaturedCategory() {
    const { data, error } = useSWR("/featured", courseService.getFeaturedCourses)
    if (error) return error
    if (!data) return <PageSpinner />

    return (<>
        <Container>
            <p className={styles.pStyle}>DESTAQUE</p>
            <SlideSection newestCourses={data.data}></SlideSection>
        </Container>
    </>)
}