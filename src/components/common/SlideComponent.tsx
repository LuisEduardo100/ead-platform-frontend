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
    serie: string
}

const SlideComponent = function ({ course, serie }: props) {
    const filteredCourses = course.filter(course => course.serie === serie);

    let slideCount = 0;

    if (filteredCourses && filteredCourses.length > 4) {
        slideCount = 4;
    } else if (course) {
        slideCount = filteredCourses.length;
    }

    return (
        <>
            <div className="d-flex flex-column py-2">
                <Splide
                    options={{
                        perPage: slideCount,
                        perMove: 1,
                        width: slideCount * 325,
                        pagination: false,
                        arrows: filteredCourses?.length > 4 ? true : false,
                        drag: filteredCourses?.length > 4 ? true : false,
                        breakpoints: {
                            1200: {
                                perPage: slideCount >= 2 ? 2 : 1,
                                width: slideCount >= 2 ? 640 : 300,
                                arrows: filteredCourses?.length > 2 ? true : false,
                                drag: filteredCourses?.length > 2 ? true : false,
                            },
                            640: {
                                perPage: 1,
                                width: 320,
                                arrows: filteredCourses?.length > 1 ? true : false,
                                drag: filteredCourses?.length > 1 ? true : false,
                            },
                            300: {
                                width: 300,
                            }
                        },
                    }}>
                    {filteredCourses
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

export default SlideComponent