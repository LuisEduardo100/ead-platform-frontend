'use client'
import { useRouter } from 'next/navigation'
import styles from './styles.module.scss'
import Link from 'next/link'
import { Button } from 'reactstrap'
import courseService, { CourseType, EpisodeType } from '../../../services/courseService'

interface props {
    episode: EpisodeType
    course: CourseType
}

export default function EpisodeAdaptedList({ episode, course }: props) {
    const router = useRouter()

    const handleEpisodePlayer = () => {
        router.push(`/courses/episodes/${episode.order - 1}?courseid=${course.id}&episodeid=${episode.id}`)
    }

    return (
        <div>
            <div className={styles.episodeCard}>
                <div className={styles.emptyDiv}></div>
                <div className={styles.titleAndTime} onClick={() => handleEpisodePlayer()}>
                    <p className={styles.episodeTitle}>{episode.name}</p>
                </div>
            </div>
        </div>
    );
}