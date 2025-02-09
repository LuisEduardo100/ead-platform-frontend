import useSWR from "swr"
import categoriesService from "../../../../services/categoriesService"
import PageSpinner from "../../../common/pageSpinner"
import styles from '../styles.module.scss'
import SlideComponentSearch from "../../../common/SlideComponentSearch"
import { CourseType } from "../../../../services/courseService"
import { useEffect, useState } from "react"
interface props {
  categoryId: number
  categoryName: string
  selectedYear: string
}

export default function ListCategoriesSlide({ categoryId, categoryName, selectedYear }: props) {
  const { data, error } = useSWR(`/categories/${categoryId}`, () =>
    categoriesService.getCourses(categoryId)
  )
  const [loading, setLoading] = useState(true)
  const [filteredCourses, setFilteredCourses] = useState<CourseType[]>([])

  useEffect(() => {
    if (data?.data?.Courses) {
      try {
        const newFilteredCourses = data.data.Courses.filter(
          (course: CourseType) => course.serie === selectedYear
        );
        setFilteredCourses(newFilteredCourses);
      } catch (err) {
        console.error("Erro ao filtrar os cursos:", err);
        setFilteredCourses([]); 
      }
      setLoading(false); 
    }
  }, [data, selectedYear]);

  if (error) {
    return <div>Ocorreu um erro ao carregar os dados.</div>;
  }
  if (loading || !data) return <PageSpinner />;

  return (<>
    <p className={styles.pStyle}>{categoryName}</p>
    {filteredCourses.length > 0 ? (
      <SlideComponentSearch course={filteredCourses} />
    ) : (
      <div>Nenhum curso disponível.</div>
    )}
  </>)
}