'use client';
import { useEffect, useState } from 'react';
import useSWR from 'swr';
import styles from './styles.module.scss';
import PageSpinner from '../../common/pageSpinner';
import SlideSection from '../../HomeNoAuth/slideSection';
import { Container } from 'reactstrap';
import KeepWatchingService from '../../../services/keepWatchingService';
import { CourseType } from '../../../services/courseService';
import SlideComponent from '../../common/SlideComponent';

// Função para o SWR fetcher
const fetcher = async () => {
    const courses: CourseType[] = await KeepWatchingService.fectchingOnGoingCourses();
    return courses;
};

export default function OnGoingCategory() {
    const { data, error } = useSWR('ongoingCourses', fetcher);
    const [loading, setLoading] = useState(true);
    console.log(data)
    useEffect(() => {
        if (data || error) {
            setLoading(false);
        }
    }, [data, error]);

    if (loading) return <PageSpinner />;

    if (error) return error.message;

    return (
        <Container>
            <p className={styles.pStyle}>CURSOS EM ANDAMENTO</p>
            {data!.length > 0 ? (
                <div>
                    <SlideComponent course={data!} />
                </div>
            ) : (
                <div className="text-center py-3">
                    <p className={styles.p}>Comece seu aprendizado! &#128513;&#128581;&#8205;&#9794;&#65039;</p>
                </div>
            )}

        </Container>
    );
}
