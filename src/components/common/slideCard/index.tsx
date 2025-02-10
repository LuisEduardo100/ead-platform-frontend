import styles from './styles.module.scss';
import courseService, { CourseType } from "../../../services/courseService";
import Link from 'next/link';
import Image from 'next/image';
import { useEffect, useState, useRef } from 'react';
import { Favorite, Add, PlayCircle, CheckCircle, Lock } from '@mui/icons-material';
import { useRouter } from 'next/navigation';

interface Props {
    course: CourseType;
    access: boolean;
}

// Remova a verificação de tipo ou converta para string se necessário
const getCourseId = async (courseId: string | number) => {
    const res = await courseService.getEpisodes(courseId);
    if (res.status === 200) {
        return res.data;
    }
};

const SlideCard = ({ course, access }: Props) => {
    const router = useRouter();
    const [liked, setLiked] = useState<boolean>(false);
    const [favorited, setFavorited] = useState<boolean>(false);
    const [newCourse, setNewCourse] = useState<CourseType>();
    const freeCourseAccess = course.name.toLowerCase().trim() !== 'matemática básica';
    const [isHoverActive, setIsHoverActive] = useState(false);
    const hoverTimeoutRef = useRef<NodeJS.Timeout | null>(null);

    const getCourse = async () => {
        const courseInfo = await getCourseId(course.id);
        if (courseInfo) {
            setNewCourse(courseInfo);
            setLiked(courseInfo.liked);
            setFavorited(courseInfo.favorited);
        }
    };

    useEffect(() => {
        getCourse();
    }, [course.id]);

    const handleLikeCourse = async (e: React.MouseEvent<HTMLButtonElement>) => {
        e.stopPropagation();
        if (liked) {
            await courseService.removeLike(course.id);
            setLiked(false);
        } else {
            await courseService.like(course.id);
            setLiked(true);
        }
    };

    const handleFavCourse = async (e: React.MouseEvent<HTMLButtonElement>) => {
        e.stopPropagation();
        if (favorited) {
            await courseService.removeFav(course.id);
            setFavorited(false);
        } else {
            await courseService.addToFav(course.id);
            setFavorited(true);
        }
    };

    const handleMouseEnter = () => {
        hoverTimeoutRef.current = setTimeout(() => {
            setIsHoverActive(true);
        }, 300);
    };

    const handleMouseLeave = () => {
        if (hoverTimeoutRef.current) {
            clearTimeout(hoverTimeoutRef.current);
            hoverTimeoutRef.current = null;
        }
        setIsHoverActive(false);
    };

    return (
        <>
            <div
                className={styles.cardContainer}
                onMouseEnter={handleMouseEnter}
                onMouseLeave={handleMouseLeave}
                onClick={() => {
                    if (access || !freeCourseAccess) {
                        sessionStorage.setItem("previousPage", window.location.pathname);
                        router.push(`/courses/${course.id}`);
                    }
                }}
            >
                {!access && freeCourseAccess && (
                    <div
                        style={{
                            backgroundColor: '#141414',
                            borderRadius: '50%',
                            padding: '4px 6px 8px 7px',
                            position: 'absolute',
                            right: 8,
                            top: 5,
                            color: '#ff3130'
                        }}
                    >
                        <Lock fontSize='small' />
                    </div>
                )}
                <div className={styles.imageWrapper}>
                    <Image
                        src={`${process.env.NEXT_PUBLIC_BASEURL}/${course.thumbnailUrl}`}
                        alt={course.name}
                        className={styles.slideImg}
                        width={1280}
                        height={720}
                    />
                </div>
                <div className={`${styles.hoverContent} ${isHoverActive ? styles.hoverActive : ''}`}>
                    <Image
                        src={`${process.env.NEXT_PUBLIC_BASEURL}/${course.thumbnailUrl}`}
                        alt={course.name}
                        className={styles.hoverImage}
                        width={320}
                        height={240}
                        quality={100}
                    />

                    <div className={styles.hoverDetails}>
                        {sessionStorage.getItem("vocenotadez-token") && (
                            <div className={styles.actions}>
                                {((!access && !freeCourseAccess) || access) && (
                                    <Link href={`/courses/${course.id}`} className={styles.playButton}>
                                        <PlayCircle fontSize="medium" />
                                    </Link>
                                )}
                                <button
                                    className={`${styles.actionButton} ${liked ? styles.liked : ''}`}
                                    onClick={handleLikeCourse}
                                >
                                    <Favorite fontSize="medium" />
                                </button>
                                <button
                                    className={`${styles.actionButton} ${favorited ? styles.favorited : ''}`}
                                    onClick={handleFavCourse}
                                >
                                    {favorited ? (
                                        <CheckCircle fontSize="medium" />
                                    ) : (
                                        <Add fontSize="medium" />
                                    )}
                                </button>
                            </div>
                        )}
                        <div className='d-flex flex-column gap-1'>
                            <h3 className={styles.courseName}>{course.name}</h3>
                            <p className={styles.episodeLength}>
                                {newCourse ? newCourse.Episodes?.length : '0'} episódios
                            </p>
                            <p className={styles.courseSynopsis}>{course.synopsis}</p>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
};

export default SlideCard;
