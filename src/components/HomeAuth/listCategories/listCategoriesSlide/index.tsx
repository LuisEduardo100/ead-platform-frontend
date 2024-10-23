import useSWR from "swr"
import categoriesService from "../../../../services/categoriesService"
import PageSpinner from "../../../common/pageSpinner"
import styles from '../styles.module.scss'
import SlideComponent from "../../../common/SlideComponent"
import { Container } from "reactstrap"
interface props {
    categoryId: number
    categoryName: string
    selectedYear: string
}

export default function ListCategoriesSlide({ categoryId, categoryName, selectedYear }: props) {
    const { data, error } = useSWR(`/categories/${categoryId}`, () =>
        categoriesService.getCourses(categoryId)
    )

    if (error) return error
    if (!data) return <PageSpinner />

    return (<>
        <p className={styles.pStyle}>{categoryName}</p>
        <Container>
            <SlideComponent course={data.data.Courses} serie={selectedYear} />
        </Container>
    </>)
}