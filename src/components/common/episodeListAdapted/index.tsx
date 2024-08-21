'use client'
import { useRouter } from 'next/navigation'
import styles from './styles.module.scss'
import Link from 'next/link'
import { Button } from 'reactstrap'
import courseService, { CourseType, EpisodeType } from '../../../services/courseService'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faSquareCheck } from '@fortawesome/free-solid-svg-icons'
import { faSquare } from '@fortawesome/free-regular-svg-icons'

interface props {
    episode: EpisodeType
    course: CourseType
}

export default function EpisodeAdaptedList({ episode, course }: props) {
    const div_watched = styles.div_watched
    const div_container = styles.div_container
    const router = useRouter()

    const handleEpisodePlayer = () => {
        router.push(`/courses/episodes/${episode.order - 1}?courseid=${course.id}&episodeid=${episode.id}`)
    }

    const isWatched = course.watchStatus.some(status=> status.episodeId === episode.id)
    return (
        <div className={isWatched ? div_watched : div_container}>
                <ul className={styles.ul}> 
                    <li className={styles.ul_item}>
                        {isWatched ? <FontAwesomeIcon icon={faSquareCheck} style={{fontSize: '24px', color: '#183153'}}/> : <FontAwesomeIcon icon={faSquare} style={{fontSize: '24px', color: '#183153'}}/>}
                      <p className={styles.episodeTitle} onClick={() => handleEpisodePlayer()}>{episode.name}</p>
                    </li>
                </ul>
        </div>
    );
}