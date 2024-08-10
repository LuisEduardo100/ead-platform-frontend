'use client'
import { useRouter } from 'next/navigation'
import { CourseType, EpisodeType } from '../../services/courseService'
import styles from './styles.module.scss'
import Link from 'next/link'
import { Button } from 'reactstrap'

interface props {
    episode: EpisodeType
    course: CourseType
}

export default function  EpisodeList({ episode, course }: props) {
    const router = useRouter()


    const handleEpisodePlayer = () => {
        router.push(`/courses/episodes/${episode.order - 1}?courseid=${course.id}&episodeid=${episode.id}`)
    }
    // /episodes/stream?videoUrl=videos/course-8/2024-04-26 23-33-02.mk
    const handleSecondsToMin = (totalSeconds: number) => {
        const minutes = Math.floor(totalSeconds / 60);
        const seconds = totalSeconds % 60;

        function toString(num: number) {
            return num.toString().padStart(2, "0");
        }
        const result = `${toString(minutes)}:${toString(seconds)}`;

        return result;
    };
    return (
        <>
            <div className={styles.episodeCard}>
            <hr />
                <div className={styles.titleAndTime} onClick={() => handleEpisodePlayer()}>
                    <p className={styles.episodeTitle}>{episode.name}</p>
                    <p className={styles.episodeTime}>{`${handleSecondsToMin(episode.secondsLong)}`}</p>
                </div>
                <p className={styles.episodeDescription}>{episode.synopsis}</p>
            </div>
        </>
    );
}