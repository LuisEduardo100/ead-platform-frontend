'use client';
import useSWR from 'swr';
import styles from './styles.module.scss';
import courseService, { CourseType } from '../../../services/courseService';
import PageSpinner from '../../common/pageSpinner';
import HeaderAuth from '../header';
import { Button, Container } from 'reactstrap';
import Link from 'next/link';
import { PlayArrow, Reply } from '@mui/icons-material';
import { useYear } from '../selectBox/yearProvider';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';

export default function HomeAuthPresentation() {
    const { data, error } = useSWR('/featured', courseService.getFeaturedCourses);
    const { selectedYear } = useYear();
    const [filteredFeaturedCourses, setFilteredFeaturedCourses] = useState<CourseType[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (data) { 
            const filteredData = data.data.filter((course: CourseType) => course.serie === selectedYear);
            setFilteredFeaturedCourses(filteredData);
        } else {
            setFilteredFeaturedCourses([]);
        }
        setLoading(false);
    }, [data, selectedYear]); 

    console.log(filteredFeaturedCourses)
    
    if (error) return <div>Erro ao carregar os cursos.</div>;
    if (loading) return <PageSpinner />;

    return (
        <>
            {filteredFeaturedCourses.length > 0 ? (
                filteredFeaturedCourses.map((course: CourseType) => (
                    <div
                        key={course.id}
                        style={{
                            backgroundImage: `linear-gradient(to bottom, #dadada04, #E8E8E8), url(${process.env.NEXT_PUBLIC_BASEURL}/${course.featuredImage})`,
                        }}
                        className={styles.divMain}
                    >
                        <HeaderAuth />
                        <div className={styles.containerStyle}>
                            <p className={styles.title}>{course.featuredName}</p>
                            <p className={styles.description}>{course.synopsis}</p>
                            <Link legacyBehavior href={`/courses/${course.id}`}>
                                <div className={styles.divButton}>
                                    <p className={styles.pAssistirAgora}>Assita agora  <Reply className={styles.redoAssistirAgora} /></p>
                                    <Button outline color="light" className={styles.button}>
                                        PLAY
                                    </Button>
                                </div>
                            </Link>
                        </div>
                    </div>
                ))[0]
            ) : (
                <p>Nenhum curso disponível para o ano selecionado.</p>
            )}
        </>
    );
}