'use client'
import { useEffect, useState } from "react"
import { useRouter, useSearchParams } from 'next/navigation'
import useSWR from 'swr'
import styles from '../styles/todosCursos.module.scss'
import HeaderGeneric from "../../src/components/common/headerGeneric"
import HeaderAuth from "../../src/components/HomeAuth/header"
import PageSpinner from '../../src/components/common/pageSpinner'
import FooterAuth from '../../src/components/HomeAuth/footerAuth'
import categoriesService, { CategoryType } from '../../src/services/categoriesService'
import CursosDaCategoria from '../../src/components/HomeAuth/todosOsCursos'
import { LibraryBooks } from '@mui/icons-material'
import AddIcon from '@mui/icons-material/Add'
import CloseIcon from '@mui/icons-material/Close'
import { useMenu } from "../../src/components/common/menu/menuProvider"
import { useYear } from "../../src/components/HomeAuth/selectBox/yearProvider"
import profileService from "../../src/services/profileService"

export default function AllCourses() {
  const { isMenuOpen } = useMenu()
  const paramsCategoria = useSearchParams().get('categoria') || 'Matemática'
  const [user, setUser] = useState(false)
  const [loading, setLoading] = useState(true)
  const [selectedCategory, setSelectedCategory] = useState(paramsCategoria)
  const [selectedCategoryId, setSelectedCategoryId] = useState<number | null>(null)
  const [showCategories, setShowCategories] = useState(false)
  const [isLargeScreen, setIsLargeScreen] = useState(true)
  const { selectedYear, onYearChange } = useYear()
  const router = useRouter()
  const { data } = useSWR('/categories', categoriesService.getCategories)

  
  useEffect(() => {
    setSelectedCategory(paramsCategoria)
  }, [paramsCategoria])

  useEffect(() => {
    profileService.fetchCurrent().then((user) => {
      onYearChange(user?.serie)
      setLoading(false)
    })
  })

  useEffect(() => {
    if (data?.length) {
      const selectedCat = data.find((cat: CategoryType) =>
        cat.name.trim().toLowerCase() === selectedCategory.trim().toLowerCase()
      )
      setSelectedCategoryId(selectedCat?.id || null)
    }
  }, [data, selectedCategory])

  useEffect(() => {
    const token = sessionStorage.getItem('vocenotadez-token')
    setUser(!!token)
    const timeoutId = setTimeout(() => {
      setLoading(false)
    }, 500)
    return () => clearTimeout(timeoutId)
  }, [])

  useEffect(() => {
    const checkScreenSize = () => {
      const isLarge = window.innerWidth <= 768
      setIsLargeScreen(!isLarge)
      if (isLarge) {
        setShowCategories(true)
      }
    }
    checkScreenSize()
    window.addEventListener('resize', checkScreenSize)
    return () => window.removeEventListener('resize', checkScreenSize)
  }, [])

  const handleCategoryClick = (categoria: CategoryType) => {
    setSelectedCategory(categoria.name)
    if (!isLargeScreen) {
      setShowCategories(false)
    }
    router.push(`/todos-os-cursos?categoria=${categoria.name}`)
  }

  if (loading) return <PageSpinner />

  return (
    <main className={`${styles.main} ${isMenuOpen ? styles.menuOpen : ''}`}>
      {user ? (
        <HeaderAuth />
      ) : (
        <HeaderGeneric btnContent="Voltar" btnUrl="/home" logoUrl="/logo-vocenotadez.png" />
      )}
      <div style={{ padding: '20px 50px', flex: '1'}}>
        {isLargeScreen ? (
          <div className={styles.containerSections}>
            <section className={styles.categorias}>
              <h1 className={styles.titulo}>Matérias</h1>
              <ul>
                {data?.length > 0 &&
                  data.map((categoria: CategoryType) => (
                    <li
                      key={categoria.id}
                      className={`${styles.li} ${selectedCategory.trim().toLowerCase() === categoria.name.trim().toLowerCase()
                          ? styles.selected
                          : ''
                        }`}
                      onClick={() => handleCategoryClick(categoria)}
                    >
                      {categoria.name}
                    </li>
                  ))}
              </ul>
            </section>
            <section className={styles.cursos}>
              {!selectedCategoryId ? (
                <div className="d-flex flex-column justify-content-center align-items-center py-5">
                  <LibraryBooks style={{ fontSize: '60px', marginBottom: '16px' }} />
                  <p>Selecione uma matéria</p>
                </div>
              ) : (
                <>
                  <h1 className={styles.titulo}>Escolha um assunto</h1>
                  <CursosDaCategoria CategoryId={selectedCategoryId} />
                </>
              )}
            </section>
          </div>
        ) : (
          <>
            <div className={styles.topBar}>
              <button
                className={styles.toggleButton}
                onClick={() => setShowCategories(prev => !prev)}
                aria-label={showCategories ? "Fechar matérias" : "Abrir matérias"}
              >
                {showCategories ? <CloseIcon /> : <AddIcon />}
                <span className={styles.toggleLabel}>Matérias</span>
              </button>
            </div>
            {showCategories && (
              <section className={styles.categorias}>
                <h1 className={styles.titulo}>Matérias</h1>
                <ul>
                  {data?.length > 0 &&
                    data.map((categoria: CategoryType) => (
                      <li
                        key={categoria.id}
                        className={`${styles.li} ${selectedCategory.trim().toLowerCase() === categoria.name.trim().toLowerCase()
                            ? styles.selected
                            : ''
                          }`}
                        onClick={() => handleCategoryClick(categoria)}
                      >
                        {categoria.name}
                      </li>
                    ))}
                </ul>
              </section>
            )}
            <section className={styles.cursos}>
              {!selectedCategoryId ? (
                <div className="d-flex flex-column justify-content-center align-items-center py-5">
                  <LibraryBooks style={{ fontSize: '60px', marginBottom: '16px' }} />
                  <p>Selecione uma matéria</p>
                </div>
              ) : (
                <>
                  <h1 className={styles.titulo}>Escolha um assunto</h1>
                  <CursosDaCategoria CategoryId={selectedCategoryId} />
                </>
              )}
            </section>
          </>
        )}
      </div>
      <FooterAuth/>
    </main>
  )
}
