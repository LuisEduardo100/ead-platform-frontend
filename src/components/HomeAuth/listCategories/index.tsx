'use client'
import PageSpinner from '../../common/pageSpinner'
import useSWR from 'swr'
import categoriesService, { CategoryType } from '../../../services/categoriesService'
import ListCategoriesSlide from './listCategoriesSlide'
import { Container } from 'reactstrap'
import styles from './styles.module.scss'
import { useYear } from '../selectBox/yearProvider'
import { useEffect, useState } from 'react'
export default function ListCategories() {
    const {selectedYear, onYearChange} = useYear()
    const [loading, setLoading] = useState(true)
    const { data, error } = useSWR("/categories", categoriesService.getCategories)
    
    useEffect(() => {
        if (selectedYear) setLoading(false)
    }, [selectedYear])

    if (error) return error
    if (!data || loading) return <PageSpinner />

    return (<>
        {data?.map((category: CategoryType) => (
            <div style={{padding: '20px 50px'}} key={category.id}>
                <ListCategoriesSlide key={category.id} selectedYear={selectedYear} categoryId={category.id} categoryName={category.name.toUpperCase()}/>
            </div>
        ))}
    </>)
}