// @ts-ignore
import '@splidejs/react-splide/css'
// @ts-ignore
import { Splide, SplideSlide } from '@splidejs/react-splide';
// @ts-ignore
import { CourseType } from '../../services/courseService'
// @ts-ignore
import SlideCard from './slideCard'

export interface props {
    course: CourseType[]
}

const SlideComponentNoYear = function ({ course }: props) {
    let slideCount = 0;

    if (course && course.length > 4) {
        slideCount = 4;
    } else if (course) {
        slideCount = course.length;
    }

    return (
        <>
            <div className="d-flex flex-column py-2">
                <Splide
                    options={{
                        perPage: slideCount,
                        perMove: 1,
                        width: slideCount * 325,
                        pagination: true,
                        arrows: course?.length > 4 ? true : false,
                        drag: course?.length > 4 ? true : false,
                        breakpoints: {
                            1200: {
                                perPage: slideCount >= 2 ? 2 : 1,
                                width: slideCount >= 2 ? 640 : 300,
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
                                width: 300,
                            }
                        },
                    }}>
                    {course
                        .map(course => (                          
                            <SplideSlide key={course.id}>
                                <SlideCard course={course} />
                            </SplideSlide>
                        ))
                    }
                </Splide>
            </div>
        </>
    );
}

export default SlideComponentNoYear