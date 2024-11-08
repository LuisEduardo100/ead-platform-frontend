'use client';
import { useEffect, useState } from 'react';
import useSWR from 'swr';
import styles from './styles.module.scss';
import PageSpinner from '../../common/pageSpinner';
import { Container } from 'reactstrap';
import KeepWatchingService from '../../../services/keepWatchingService';
import { CourseType } from '../../../services/courseService';
import SlideComponent from '../../common/SlideComponent';

// Função para o SWR fetcher
const fetcher = async () => {
    const courses: CourseType[] = await KeepWatchingService.fectchingOnGoingCourses();
    return courses;
};

export default function OnGoingCategory({ selectedYear }: { selectedYear: string }) {
    const { data, error } = useSWR('ongoingCourses', fetcher);
    const [loading, setLoading] = useState(true);
    useEffect(() => {
        if (data || error) {
            setLoading(false);
        }
    }, [data, error]);

    if (loading) return <PageSpinner />;

    if (error) return error.message;

    return (
        data!.length > 0 && (
        <Container>
            <p className={styles.pStyle}>CURSOS EM ANDAMENTO</p>
                <div>
                    <SlideComponent course={data!} serie={selectedYear} />
                </div>
        </Container>
        )
    );
}
