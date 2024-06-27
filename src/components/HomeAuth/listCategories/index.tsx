'use client'
import { Container } from 'reactstrap'
import styles from './styles.module.scss'
import SlideSection from '../../HomeNoAuth/slideSection'
import PageSpinner from '../../common/pageSpinner'
import courseService from '../../../services/courseService'
import useSWR from 'swr'
import categoriesService from '../../../services/categoriesService'

export default function ListCategories(){
    const { data, error } = useSWR("/featured", categoriesService.getCategories)
    if (error) return error
    if (!data) return <PageSpinner />

    return (<>
        <Container>
            <p className={styles.pStyle}>DESTAQUE</p>
            <SlideSection newestCourses={data.data}></SlideSection>
        </Container>
    </>)
}