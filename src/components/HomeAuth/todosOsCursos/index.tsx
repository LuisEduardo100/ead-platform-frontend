'use client'
import styles from './style.module.scss'
import { useEffect, useState } from "react"
import categoriesService from "../../../services/categoriesService"
import { CourseType } from "../../../services/courseService"
import CourseCard from "./courseCard"

export default function CursosDaCategoria({CategoryId} : {CategoryId: number}) {
    const [courses, setCourses] = useState<CourseType[]>([])
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState<string | null>(null) 
  
    useEffect(() => {
      const getAllCourses = async () => {
        setLoading(true)
        setError(null)
  
        try {
          const res = await categoriesService.getCourses(CategoryId);
  
          if (res.status === 200) { 
            setCourses(res.data.Courses)
          } else {
            setError("Erro ao carregar cursos.")
          }
        } catch (err) {
          setError("Erro na requisição.")
        } finally {
          setLoading(false)
        }
      };
  
      if (CategoryId) { 
        getAllCourses()
      } else {
        setLoading(false)
      }
    }, [CategoryId])
  
    if (loading) {
      return <div>Carregando cursos...</div>
    }
  
    if (error) {
      return <div>{error}</div>
    }
  
    return (
      <div className={styles.lista_cursos}>
        {courses.length > 0 ? (
          <ul className={styles.courses_grid}>
            {courses.map((course) => (
              <li key={course.id} className={styles.course_item}>
                <CourseCard course={course}/>
              </li>
            ))}
          </ul>
        ) : (
          <p>Nenhum curso encontrado para esta categoria.</p>
        )}
      </div>
    );
  }
  