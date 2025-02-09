'use client'
import styles from './style.module.scss'
import { useEffect, useState } from "react"
import categoriesService from "../../../services/categoriesService"
import { CourseType } from "../../../services/courseService"
import CourseCard from "./courseCard"
import BtnSpinner from '../../common/btnSpinner'
import profileService from '../../../services/profileService'
import ToastComponent from '../../common/toastComponent'

export default function CursosDaCategoria({ CategoryId }: { CategoryId: number }) {
  const [courses, setCourses] = useState<CourseType[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [hasFullAccess, setHasFullAccess] = useState(true)
  const [toastColor, setToastColor] = useState("");
  const [toastIsOpen, setToastIsOpen] = useState(false);
  const [toastMessage, setToastMessage] = useState("");

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const userData = await profileService.fetchCurrent();
        setHasFullAccess(userData.hasFullAccess);
      } catch (error) {
        console.error("Erro ao buscar perfil do usuário:", error);
      }
    };
    fetchProfile();
  }, []);

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
    return <BtnSpinner />
  }

  if (error) {
    return <div>{error}</div>
  }

  const handleDeniedClick = () => {
    if (!hasFullAccess) {
      setToastIsOpen(true);
      setToastColor("bg-danger");
      setToastMessage("Matricule-se para ter acesso.");
      setTimeout(() => setToastIsOpen(false), 3000);
    }
  }

  return (
    <div className={styles.lista_cursos}>
      <ToastComponent isOpen={toastIsOpen} color={toastColor} message={toastMessage} />

      {courses.length > 0 ? (
        <ul className={styles.courses_grid}>
          {courses.map((course) => (
            <li key={course.id} className={styles.course_item} onClick={handleDeniedClick}>
              <CourseCard course={course} access={hasFullAccess} />
            </li>
          ))}
        </ul>
      ) : (
        <p>Nenhum curso encontrado para esta categoria.</p>
      )}
    </div>
  );
}
