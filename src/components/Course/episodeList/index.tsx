// components/Course/EpisodeList.tsx
import React, { useEffect, useState } from "react";
import styles from "./styles.module.scss";
import { CheckCircle, PictureAsPdf, PlayArrow, PlayCircle } from "@mui/icons-material";
import { CourseType, EpisodeType, WatchStatus } from "../../../services/courseService";
import Link from "next/link";
import episodeFileService from "../../../services/episodeFileService";
import profileService from "../../../services/profileService";
import { useRouter } from "next/navigation";

type EpisodeListProps = {
    episode: EpisodeType;
    course: CourseType;
};

const EpisodeList: React.FC<EpisodeListProps> = ({ episode, course }) => {
    const router = useRouter()

    /* User premium handler */
    
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

    /* Episode file handler */

    const [episodeFile, setEpisodeFile] = useState<EpisodeType>();

    const handleEpisodeFile = async () => {
        try {
            const res = await episodeFileService.getEpisodeWithFile(episode.id);
            if (res) {
                setEpisodeFile(res);
            } else {
                console.error("No files found in the response.");
            }
        } catch (error) {
            console.error("Error fetching episode file:", error);
        }
    };

    useEffect(() => {
        handleEpisodeFile();
    }, [episode.id]);

    let completePdfUrl: string | null = null;
    if (episodeFile && episodeFile.Files && episodeFile.Files.length > 0) {
        const fileUrlArray = episodeFile.Files[0].fileUrl;
        if (fileUrlArray && fileUrlArray.length > 0) {
            const pdfUrl = fileUrlArray[0];
            completePdfUrl = `${process.env.NEXT_PUBLIC_BASEURL}/${pdfUrl}`;
        }
    }

    /* Watch time and time config */

    const isWatched = course.watchStatus?.some(
        (status: WatchStatus) => status.episodeId === episode.id
    );

    const formatDuration = (seconds: number): string => {
        const minutes = Math.floor(seconds / 60);
        const remainingSeconds = seconds % 60;
        return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
    };

    /* Episode player handler */

    const handleEpisodePlayer = () => {
        router.push(`/courses/episodes/${episode.order - 1}?courseid=${course.id}&episodeid=${episode.id}`)
    }
    
    return (
        <div className={styles.card} onClick={handleEpisodePlayer}>
            <div className={styles.info}>
                <h3 className={styles.time}>
                    <div className={styles.playBtn}>
                        <PlayArrow fontSize='medium' />
                    </div>
                    {formatDuration(episode.secondsLong)}
                </h3>
                <p className={styles.title}>{episode.name}</p>
                {completePdfUrl &&
                    completePdfUrl.toLowerCase().endsWith(".pdf") && hasFullAccess && (
                        <Link href={completePdfUrl} target="_blank" className={styles.pdfLink}>
                            <PictureAsPdf fontSize="small" style={{color: '#E50914', marginRight: '10px'}}/>
                            {episodeFile?.Files[0].name}
                        </Link>
                    )}
            </div>
            {isWatched && (
                <div className={styles.icon}>
                    <CheckCircle style={{ color: "#e50914", fontSize: 24 }} />
                </div>
            )}
        </div>
    );
};

export default EpisodeList;
