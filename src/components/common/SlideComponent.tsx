import { Splide, SplideSlide } from '@splidejs/react-splide'
import '@splidejs/react-splide/css'
import { CourseType } from '../../services/courseService'
import SlideCard from './slideCard'
export interface props {
    course: CourseType[]
}

const SlideComponent = function ({ course }: props) {  
    return (
        <>
            <div className="d-flex flex-column align-items-center py-4">
                <Splide
                    options={{
                        type: "loop",
                        perPage: 4,
                        perMove: 1,
                        width: 1280,
                        pagination: false,
                        breakpoints: {
                            1300: {
                                perPage: 2,
                                width: 640
                            },
                            730: {
                                perPage: 1,
                                width: 320
                            },
                            350: {
                                width: 260
                            }
                        },
                    }}>
                    {course?.map((course) => (
                        <SplideSlide key={course.id}>
                            <SlideCard course={course} />
                        </SplideSlide>
                    ))}
                </Splide>
            </div>
        </>
    );
}

export default SlideComponent