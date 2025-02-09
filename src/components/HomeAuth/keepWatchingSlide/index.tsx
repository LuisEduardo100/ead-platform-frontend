// components/OnGoingCategory/index.tsx
'use client';
import { useEffect, useState } from 'react';
import useSWR from 'swr';
import styles from './styles.module.scss';
import PageSpinner from '../../common/pageSpinner';
import { Container } from 'reactstrap';
import KeepWatchingService from '../../../services/keepWatchingService';
import { CourseType } from '../../../services/courseService';
import SlideComponentSearch from '../../common/SlideComponentSearch';

export default function OnGoingCategory() {
    const { data, error } = useSWR<CourseType[]>('keepWatching', KeepWatchingService.getKeepWatchingCourses);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (data || error) {
            setLoading(false);
        }
    }, [data, error]);

    if (loading) return <PageSpinner />;

    if (error) return <div>{error.message}</div>;

    return (
        data!.length > 0 && (
            <div style={{ padding: '20px 50px' }}>
                <p className={styles.pStyle}>CURSOS EM ANDAMENTO</p>
                <SlideComponentSearch course={data!} />
            </div>
        )
    );
}
