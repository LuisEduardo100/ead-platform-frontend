// @ts-ignore
import '@splidejs/react-splide/css'
// @ts-ignore
import { Splide, SplideSlide } from '@splidejs/react-splide';
// @ts-ignore
import { CourseType } from '../../services/courseService'
import SlideCard from '../../common/slideCard';
import styles from './styles.module.scss'
// @ts-ignore
export interface props {
    course: CourseType[]
}

const SlideComponentNoAuth = function ({ course }: props) {

    let slideCount = 0;

    if (course && course.length > 4) {
        slideCount = 4;
    } else if (course) {
        slideCount = course.length;
    }

    return (
        <>
            <div className={styles.divMain}>
                <Splide className={styles.splide}
                    options={{
                        type: "loop",
                        perPage: slideCount,
                        autoplay: true,
                        interval: 2000,
                        perMove: 1,
                        width: slideCount * 320,
                        pagination: false,
                        arrows: course?.length > 4 ? true : false,
                        drag: true,
                        breakpoints: {
                            1200: {
                                perPage: slideCount >= 2 ? 2 : 1,
                                width: slideCount >= 2 ? 640 : 350,
                                arrows: course?.length > 2 ? true : false,
                                drag: course?.length > 2 ? true : false,
                            },
                            640: {
                                perPage: 1,
                                width: 320,
                                arrows: course?.length > 1 ? true : false,
                                drag: course?.length > 1 ? true : false,
                            },
                            300: {
                                width: 370,
                            }
                        },

                    }}>
                    {course?.map((course) => (
                        <SplideSlide className={styles.SplideSlide} key={course.id}>
                            <SlideCard course={course} />
                        </SplideSlide>
                    ))}
                </Splide>
            </div>
        </>
    );
}

export default SlideComponentNoAuth