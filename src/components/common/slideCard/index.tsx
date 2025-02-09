import styles from './styles.module.scss';
import courseService, { CourseType } from "../../../services/courseService";
import Link from 'next/link';
import Image from 'next/image';
import { useState } from 'react';
import { Favorite, Add, PlayCircle, CheckCircle, Lock } from '@mui/icons-material';
import { useRouter } from 'next/navigation';
import ToastComponent from '../toastComponent';

interface Props {
    course: CourseType;
    access: boolean;
}

const SlideCard = ({ course, access }: Props) => {
    const router = useRouter()
    const [liked, setLiked] = useState<boolean>(false);
    const [favorited, setFavorited] = useState<boolean>(false);
    const freeCourseAccess = course.name.toLowerCase().trim() !== 'matemática básica'

    const handleLikeCourse = async () => {
        if (liked) {
            await courseService.removeLike(course.id);
            setLiked(false);
        } else {
            await courseService.like(course.id);
            setLiked(true);
        }
    };

    const handleFavCourse = async () => {
        if (favorited) {
            await courseService.removeFav(course.id);
            setFavorited(false);
        } else {
            await courseService.addToFav(course.id);
            setFavorited(true);
        }
    };

    return (<>
        <div className={styles.cardContainer} onClick={() => {
            if (access || !freeCourseAccess) {
                router.push(`/courses/${course.id}`)
            } 
        }
        }>
            {!access && freeCourseAccess && <div style={{
                backgroundColor: '#141414',
                borderRadius: '50%',
                padding: '4px 6px 8px 7px',
                position: 'absolute',
                right: 8,
                top: 5,
                color: '#ff3130'
            }}><Lock fontSize='small' /></div>}
            <div className={styles.imageWrapper}>
                <Image
                    src={`${process.env.NEXT_PUBLIC_BASEURL}/${course.thumbnailUrl}`}
                    alt={course.name}
                    className={styles.slideImg}
                    width={1280}
                    height={720}
                />
            </div>

            <div className={styles.hoverContent}>
                <Image
                    src={`${process.env.NEXT_PUBLIC_BASEURL}/${course.thumbnailUrl}`}
                    alt={course.name}
                    className={styles.hoverImage}
                    width={320}
                    height={240}
                    quality={100}
                />
                <div className={styles.hoverDetails}>
                    <div className={styles.actions}>
                        {!access && !freeCourseAccess && (
                            <Link href={`/courses/${course.id}`} className={styles.playButton}>
                                <PlayCircle fontSize="medium" />
                            </Link>
                        )}
                         {access && (
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
                    <h3 className={styles.courseName}>{course.name}</h3>
                    <p className={styles.courseSynopsis}>{course.Episodes?.length !== undefined ? course.Episodes?.length : '0'} episódios</p>
                    <p className={styles.courseSynopsis}>{course.synopsis}</p>
                </div>
            </div>
        </div>
    </>
    );
};

export default SlideCard;
