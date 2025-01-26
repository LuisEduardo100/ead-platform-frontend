import useSWR from "swr"
import categoriesService from "../../../../services/categoriesService"
import PageSpinner from "../../../common/pageSpinner"
import styles from '../styles.module.scss'
import SlideComponent from "../../../common/SlideComponent"
import { Container } from "reactstrap"
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
        // Verifica se os dados estão disponíveis antes de filtrar
        if (data?.data?.Courses) {
          setLoading(true); // Ativa o carregamento
          try {
            const newFilteredCourses = data.data.Courses.filter(
              (course: CourseType) => course.serie === selectedYear
            );
            setFilteredCourses(newFilteredCourses);
          } catch (err) {
            console.error("Erro ao filtrar os cursos:", err);
            setFilteredCourses([]); // Garante que não quebra mesmo em caso de erro
          }
          setLoading(false); // Finaliza o carregamento
        }
      }, [data, selectedYear]);
    
      if (error) {
        console.error("Erro na requisição:", error);
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