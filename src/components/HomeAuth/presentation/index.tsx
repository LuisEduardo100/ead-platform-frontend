'use client';
import useSWR from 'swr';
import styles from './styles.module.scss'
import courseService, { CourseType } from '../../../services/courseService';
import PageSpinner from '../../common/pageSpinner';
import HeaderAuth from '../header';
import { Button, Container } from 'reactstrap';
import Link from 'next/link';

export default function HomeAuthPresentation() {
    const { data, error } = useSWR('/featured', courseService.getFeaturedCourses)

    if (error) return error
    if (!data) return <PageSpinner />
    return <>
        {
            data.data.map((course: CourseType) => (
                <>
                    <div style={{
                        backgroundImage: `linear-gradient(to bottom, #5b5b5b80, #0c0c0c), url(${process.env.NEXT_PUBLIC_BASEURL}/${course.thumbnailUrl})`,
                        backgroundSize: "cover",
                        backgroundPosition: "top",
                        height: "600px",
                    }}
                    >
                        <HeaderAuth />
                        <Container className={styles.containerStyle}>
                            <p className={styles.title}>{course.name}</p>
                            <p className={styles.description}>{course.synopsis}</p>
                            <Link legacyBehavior href={`/courses/${course.id}`}>
                                <a className={styles.linkStyle}>
                                    <Button outline color="light" className={styles.button}>
                                        ASSISTA AGORA
                                        <img src="/buttonPlay.svg" alt="playBtnImg" className={styles.imgBtn}></img>
                                    </Button>
                                </a>
                            </Link>
                        </Container>
                    </div>
                </>
            ))[0]}
    </>
}