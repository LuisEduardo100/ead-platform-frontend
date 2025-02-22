import '@splidejs/splide/dist/css/splide.min.css';
import '@splidejs/react-splide/css'
//@ts-ignore
import { Splide, SplideSlide } from '@splidejs/react-splide';
import { CourseType } from '../../services/courseService';
import SlideCard from './slideCard';
import { useMenu } from './menu/menuProvider';
import { useEffect, useState } from 'react';
import profileService from '../../services/profileService';
import styles from './SlideComponent.module.scss'

interface Props {
    course: CourseType[];
}

const MENU_WIDTH = 250; // Largura fixa do menu lateral
const SLIDE_WIDTH = 320; // Largura fixa de cada slide
const GAP = 32;
const MAX_SLIDES = 10;
const getAvailableWidth = (isMenuOpen: boolean): number => window.innerWidth - (isMenuOpen ? MENU_WIDTH : 0);

const getSlideCount = (availableWidth: number, totalSlides: number): number => {
    // Ajuste dos breakpoints conforme solicitado
    if (availableWidth >= 2800) return Math.min(totalSlides, MAX_SLIDES)
    if (availableWidth >= 2500) return Math.min(totalSlides, 7);
    if (availableWidth >= 2100) return Math.min(totalSlides, 6);
    if (availableWidth >= 1800) return Math.min(totalSlides, 5);
    if (availableWidth >= 1500) return Math.min(totalSlides, 4);
    if (availableWidth >= 1200) return Math.min(totalSlides, 4);
    if (availableWidth >= 900) return Math.min(totalSlides, 2);
    if (availableWidth >= 750) return Math.min(totalSlides, 2);
    return 1; // Mobile
};

export default function SlideComponentSearch({ course }: Props) {
    const { isMenuOpen } = useMenu();
    const [slidesPerPage, setSlidesPerPage] = useState(getSlideCount(getAvailableWidth(isMenuOpen), course.length));
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

    useEffect(() => {
        const getAvailableWidth = () => window.innerWidth - (isMenuOpen ? MENU_WIDTH : 0);

        const updateSlides = () => {
            const availableWidth = getAvailableWidth();
            const newCount = getSlideCount(availableWidth, course.length);
            setSlidesPerPage(newCount);
        };

        updateSlides();

        window.addEventListener('resize', updateSlides);
        return () => window.removeEventListener('resize', updateSlides);
    }, [isMenuOpen, course.length]);

    return (
        <div className="d-flex flex-column py-2">
            <Splide
                key={slidesPerPage || 10}
                className={styles.splide}
                options={{
                    rewind: true,
                    rewindSpeed: 800,
                    perPage: slidesPerPage,
                    perMove: 1,
                    gap: GAP,
                    padding: {
                        left: 0,
                        right: 0
                    },
                    pagination: true,
                    arrows: course.length > 1,
                    drag: course.length > 1,
                    breakpoints: {
                        2800: {
                            perPage: Math.min(course.length, 7),
                        },
                        2500: {
                            perPage: Math.min(course.length, 7),
                        },
                        2100: {
                            perPage: Math.min(course.length, 6),
                        },
                        1800: {
                            perPage: Math.min(course.length, 5),
                        },
                        1500: {
                            perPage: Math.min(course.length, 4),
                        },
                        1200: {
                            perPage: Math.min(course.length, 4),
                        },
                        900: {
                            perPage: 2,
                        },
                        750: {
                            perPage: 2,
                        },
                        650: {
                            perPage: 1,
                        },
                        400: {
                            perPage: 1,
                        }
                    },
                    mediaQuery: 'min',
                }}
            >
                {course.map((item) => (
                    <SplideSlide key={item.id}
                        style={{
                            maxWidth: `${SLIDE_WIDTH}px`,
                            position: 'relative',
                            zIndex: 1
                        }}
                    >
                        <SlideCard course={item} access={hasFullAccess} />
                    </SplideSlide>
                ))}
            </Splide>
        </div>
    );
}
