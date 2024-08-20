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
    const ul_watched = styles.ul_watched
    const ul = styles.ul
    const router = useRouter()

    const handleEpisodePlayer = () => {
        router.push(`/courses/episodes/${episode.order - 1}?courseid=${course.id}&episodeid=${episode.id}`)
    }

    const isWatched = course.watchStatus.some(status=> status.episodeId === episode.id)
    return (
        <div>
                <ul className={isWatched ? ul_watched : ul}> 
                    <li className={styles.ul_item}>
                      <p className={styles.episodeTitle} onClick={() => handleEpisodePlayer()}>{episode.name}</p>
                    </li>
                </ul>
        </div>
    );
}