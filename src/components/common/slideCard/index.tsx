import styles from './styles.module.scss'
import { CourseType } from "../../../services/courseService";
import Link from 'next/link';

interface props {
    course: CourseType;
}

const SlideCard = function ({ course }: props) {
    return (
        <>
            <Link className={styles.linkStyle} href={`/courses/${course.id}`}>
                <div className={styles.imgBox}>
                    <div className={styles.slide}>
                        <img
                            src={`${process.env.NEXT_PUBLIC_BASEURL}/${course.thumbnailUrl}`}
                            alt={course.name}
                            className={styles.slideImg}
                        />

                    </div>
                    <div className={styles.divBtnPlay}>
                        <img src="/buttonPlay.svg" alt="playBtnImg" className={styles.imgBtn}></img>
                    </div>
                </div>
            </Link>
        </>
    )
};

export default SlideCard;