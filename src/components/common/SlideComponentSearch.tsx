import '@splidejs/splide/dist/css/splide.min.css';
// @ts-ignore
import '@splidejs/react-splide/css'
// @ts-ignore
import { Splide, SplideSlide } from '@splidejs/react-splide';
// @ts-ignore
import { CourseType } from '../../services/courseService'
// @ts-ignore
import SlideCard from './slideCard'
import { useMenu } from './menu/menuProvider';

export interface props {
    course: CourseType[]
}


export default function SlideComponentSearch({ course }: props) {
    const { isMenuOpen } = useMenu()

    const MENU_WIDTH = 250; // Largura fixa do menu lateral
    const slideWidth = 320; // Largura fixa de cada slide

    const getAvailableWidth = (): number => window.innerWidth - (isMenuOpen ? MENU_WIDTH : 0); // Largura disponível para os slides

    const getSlideCount = (availableWidth: number): number => {
        if (availableWidth >= 2400) return Math.min(course.length, 8);
        if (availableWidth >= 2000) return Math.min(course.length, 7);
        if (availableWidth >= 1600) return Math.min(course.length, 5);
        if (availableWidth >= 1200) return Math.min(course.length, 4);
        if (availableWidth >= 800) return Math.min(course.length, 3);
        if (availableWidth >= 480) return Math.min(course.length, 2);
        return 1;
    };

    const availableWidth = getAvailableWidth();
    const slidesPerPage = getSlideCount(availableWidth);
    return (
        <>
            <div className="d-flex flex-column py-2">
                <Splide
                    options={{
                        rewind: true,
                        rewindSpeed: 800,
                        perPage: slidesPerPage,
                        perMove: 1,
                        gap: '1rem',
                        width: `calc(${slidesPerPage} * ${slideWidth}px + ${(slidesPerPage - 1) * 16}px)`,
                        pagination: true,
                        arrows: course.length > 1,
                        drag: course.length > 1,
                        breakpoints: {
                            2400: { perPage: 8, width: slideWidth * 8 + 112 },
                            2000: { perPage: 7, width: slideWidth * 7 + 96 },
                            1600: { perPage: 5, width: slideWidth * 5 + 64 },
                            1200: { perPage: 4, width: slideWidth * 4 + 48 },
                            800: { perPage: 3, width: slideWidth * 3 + 32 },
                            480: { perPage: 1, width: slideWidth },
                        },
                    }}
                >
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
