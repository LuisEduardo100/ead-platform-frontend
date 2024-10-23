'use client'
import PageSpinner from '../../common/pageSpinner'
import useSWR from 'swr'
import categoriesService, { CategoryType } from '../../../services/categoriesService'
import ListCategoriesSlide from './listCategoriesSlide'
import { Container } from 'reactstrap'

export default function ListCategories({ selectedYear }: { selectedYear: string }) {
    const { data, error } = useSWR("/categories", categoriesService.getCategories)
    if (error) return error
    if (!data) return <PageSpinner />

    return (<>
        {data?.map((category: CategoryType) => (
            <Container key={category.id}>
                <ListCategoriesSlide key={category.id} selectedYear={selectedYear} categoryId={category.id} categoryName={category.name.toUpperCase()}/>
            </Container>
        ))}
    </>)
}