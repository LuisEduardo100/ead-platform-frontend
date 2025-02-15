'use client';
import { useEffect, useState } from 'react';
import FavoriteCourses from '../../src/components/HomeAuth/favoriteCategory'
import FeaturedCategory from '../../src/components/HomeAuth/featuredCategory'
import ListCategories from '../../src/components/HomeAuth/listCategories'
import NewestCategory from '../../src/components/HomeAuth/newestCategory'
import HomeAuthPresentation from '../../src/components/HomeAuth/presentation'
import AOS from 'aos';
import 'aos/dist/aos.css';
import FooterAuth from '../../src/components/HomeAuth/footerAuth';
import { useMenu } from '../../src/components/common/menu/menuProvider';
import styles from './styles.module.scss'
import { useRouter } from 'next/navigation';
import PageSpinner from '../../src/components/common/pageSpinner';
import { useYear } from '../../src/components/HomeAuth/selectBox/yearProvider';
import profileService from '../../src/services/profileService';
import OnGoingCategory from '../../src/components/HomeAuth/keepWatchingSlide';

const HomeAuth = function () {
    const router = useRouter()
    const { isMenuOpen } = useMenu();
    const {selectedYear, onYearChange} = useYear()
    const [userSerie, setUserSerie] = useState<string | null>()
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        AOS.init();
        AOS.refresh();
    }, []);

    useEffect(()=> {
        const intervalID = setInterval(() => {
            setLoading(false)
        }, 500)
        return () => clearInterval(intervalID)
    })
    useEffect(() => {
        if (!sessionStorage.getItem("vocenotadez-token")) {
            router.push("/login");
        } 
    }, [router])

    useEffect(()=> {
        profileService.fetchCurrent().then((user)=>{
            setUserSerie(user.serie)
        })
    })

    useEffect(() => {
        if (userSerie) {
            onYearChange(userSerie)
        }
    }, [userSerie])

    if (loading) return <PageSpinner/>
    return (
        <>
            <main className={`${styles.main} ${isMenuOpen ? styles.menuOpen : ""}`}>
                <HomeAuthPresentation />
                <div className='pb-5' data-aos="fade-right" data-aos-duration="500" data-aos-offset="300">
                    <OnGoingCategory />
                    <NewestCategory />
                    <FavoriteCourses />
                    <FeaturedCategory />
                    <ListCategories />
                </div>
                <FooterAuth />
            </main>
        </>
    );
};

export default HomeAuth