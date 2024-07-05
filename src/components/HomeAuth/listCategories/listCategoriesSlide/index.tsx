import useSWR from "swr"
import categoriesService from "../../../../services/categoriesService"
import PageSpinner from "../../../common/pageSpinner"
import styles from '../styles.module.scss'
import SlideSection from "../../../HomeNoAuth/slideSection"
import SlideComponent from "../../../common/SlideComponent"
interface props {
    categoryId: number
    categoryName: string
}

export default function ListCategoriesSlide ({categoryId, categoryName}: props){
    const { data, error } = useSWR(`/categories/${categoryId}`, ()=>
        categoriesService.getCourses(categoryId)
    )

    if (error) return error
    if (!data) return <PageSpinner />

    return (<>
        <p className={styles.pStyle}>{categoryName}</p>
        <SlideComponent course={data.data.Courses}/>
    </>)
}