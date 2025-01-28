import styles from './styles.module.scss'
import { CourseType } from "../../../services/courseService";
import Link from 'next/link';
import Image from 'next/image';

interface props {
    course: CourseType;
}

const SlideCard = function ({ course }: props) {
    return (
        <>
            <Link className={styles.linkStyle} href={`/courses/${course.id}`}>
                <div className={styles.imgBox}>
                    <div className={styles.slide}>
                        <Image
                            src={`${process.env.NEXT_PUBLIC_BASEURL}/${course.thumbnailUrl}`}
                            alt={course.name}
                            className={styles.slideImg}
                            width={300}
                            height={210}
                        />
                    </div>
                    <div className={styles.divBtnPlay}>
                        <Image src="/buttonPlay.svg" alt="playBtnImg" className={styles.imgBtn} width={100} height={100}/>
                    </div>
                </div>
            </Link>
        </>
    )
};

export default SlideCard;