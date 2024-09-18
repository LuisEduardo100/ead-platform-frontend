'use client'
import PageSpinner from '../pageSpinner'
import useSWR from 'swr'
import categoriesService, { CategoryType } from '../../../services/categoriesService'
import ListCategoriesSlide from './listCategoriesSlide'
import { Container } from 'reactstrap'

export default function ListCategoriesForBranding() {
    const { data, error } = useSWR("/categories", categoriesService.getCategoriesForBranding)
    if (error) return error
    if (!data) return <PageSpinner />

    return (<>
        {data.map((category: CategoryType) => (
            <Container key={category.id}>
                <ListCategoriesSlide key={category.id} categoryId={category.id} categoryName={category.name.toUpperCase()}/>
            </Container>
        ))}
    </>)
}