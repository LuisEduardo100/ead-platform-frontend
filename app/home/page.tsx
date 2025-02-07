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

const HomeAuth = function () {
    const router = useRouter()
    const { isMenuOpen } = useMenu();
    const [loading, setLoading] = useState(true);
    const {selectedYear, onYearChange} = useYear()

    useEffect(() => {
        AOS.init();
        AOS.refresh();
    }, []);

    useEffect(() => {
        if (!sessionStorage.getItem("vocenotadez-token")) {
            setLoading(false)
            router.push("/login");
        } 
    }, [router])

    useEffect(()=> {
        profileService.fetchCurrent().then((user)=>{
            onYearChange(user?.serie)
            setLoading(false)
        })
    })

    if (loading) return <PageSpinner/>
    return (
        <>
            <main className={`${styles.main} ${isMenuOpen ? styles.menuOpen : ""}`}>
                <HomeAuthPresentation />
                <div className='pb-5' data-aos="fade-right" data-aos-duration="500" data-aos-offset="300">
                    {/* <OnGoingCategory selectedYear={selectedYear} /> */}
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