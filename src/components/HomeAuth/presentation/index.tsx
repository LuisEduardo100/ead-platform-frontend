'use client';
import useSWR from 'swr';
import styles from './styles.module.scss'
import courseService, { CourseType } from '../../../services/courseService';
import PageSpinner from '../../common/pageSpinner';
import HeaderAuth from '../header';
import { Button, Container } from 'reactstrap';
import Link from 'next/link';
import { PlayArrow, Reply } from '@mui/icons-material';
import { useYear } from '../selectBox/yearProvider';


export default function 
HomeAuthPresentation() {
    const { data, error } = useSWR('/featured', courseService.getFeaturedCourses)
    const { selectedYear, onYearChange } = useYear()
    const filteredFeaturedCourses = data?.data?.filter((course: CourseType) => course.serie === selectedYear);
    
    if (error) return error
    if (!data) return <PageSpinner />
    return <>
        {
            filteredFeaturedCourses.map((course: CourseType) => (
                <>
                    <div style={{
                        backgroundImage: `linear-gradient(to bottom, #dadada04, #E8E8E8), url(${process.env.NEXT_PUBLIC_BASEURL}/${course.featuredImage})`,
                        backgroundSize: "cover",
                        backgroundPosition: "center",
                        height: "750px",
                    }}
                    >
                        <HeaderAuth/>
                        <Container className={styles.containerStyle}>
                            <p className={styles.title}>{course.featuredName}</p>
                            <p className={styles.description}>{course.synopsis}</p>
                            <Link legacyBehavior href={`/courses/${course.id}`}>
                                <div className={styles.divButton}>
                                    <p className={styles.pAssistirAgora}>Assita agora  <Reply className={styles.redoAssistirAgora} /></p>
                                    <Button outline color="light" className={styles.button}>
                                        PLAY
                                        <PlayArrow style={{ fontSize: '42px' }} />
                                    </Button>
                                </div>
                            </Link>
                        </Container>
                    </div>
                </>
            ))[0]}
    </>
}