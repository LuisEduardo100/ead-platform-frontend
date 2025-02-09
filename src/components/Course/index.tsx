'use client'
import { useRouter } from 'next/navigation'
import { CourseType, EpisodeType, WatchStatus } from '../../services/courseService'
import styles from './styles.module.scss'
import episodeFileService from '../../services/episodeFileService'
import { useEffect, useState } from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faCircleCheck as faCircleCheckSolid, faCirclePlay, faCloudArrowDown } from '@fortawesome/free-solid-svg-icons'
import FileListToCourse from '../common/filePageToCourse'
import profileService from '../../services/profileService'

interface props {
    episode: EpisodeType
    course: CourseType
}

export default function EpisodeList({ episode, course }: props) {
    const router = useRouter()
    const [getEpisodeFile, setGetEpisodeFile] = useState<EpisodeType>()
    const [hasFullAccess, setHasFullAccess] = useState(true)

    useEffect(() => {
        const fetchProfile = async () => {
            try {
                const userData = await profileService.fetchCurrent();
                setHasFullAccess(userData.hasFullAccess);
            } catch (error) {
                console.error("Erro ao buscar perfil do usuário:", error);
            }
        };
        fetchProfile();
    }, []);

    const handleEpisodeFile = async () => {
        try {
            const res = await episodeFileService.getEpisodeWithFile(episode.id);
            if (res) {
                setGetEpisodeFile(res);
            } else {
                console.error('No files found in the response.');
            }
        } catch (error) {
            console.error('Error fetching episode file:', error);
        }
    };

    useEffect(() => {
        handleEpisodeFile();
    }, [episode.id]);


    const hasFile = getEpisodeFile?.Files && getEpisodeFile?.Files.length > 0
    const File = hasFile ? getEpisodeFile.Files[0] : null

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

    const isWatched = course.watchStatus?.some(status => status.episodeId === episode.id);
    return (
        <>
            <div className={styles.episodeCard}>
                <div className={styles.episodeTimeDiv} onClick={handleEpisodePlayer}>
                    <div className={styles.playIconAndTime}>
                        <FontAwesomeIcon icon={faCirclePlay} style={{ color: "#183153", fontSize: "30px" }} />
                        <p className={styles.episodeTime}>{`${handleSecondsToMin(episode.secondsLong)}`}</p>
                    </div>
                    <p className={styles.episodeTitle}>{episode.name}</p>
                </div>
                {isWatched &&
                    <FontAwesomeIcon className={styles.checkItem} icon={faCircleCheckSolid} style={{ fontSize: '30px', color: '#183153' }} />
                }
                <div className={styles.divFileUrl}>
                    {hasFile && hasFullAccess && (
                        <FileListToCourse files={getEpisodeFile.Files} />
                    )}
                </div>
            </div>
        </>
    );
}