'use client';
import { useEffect, useState } from 'react';
import FavoriteCourses from '../../src/components/HomeAuth/favoriteCategory'
import FeaturedCategory from '../../src/components/HomeAuth/featuredCategory'
import OnGoingCategory from '../../src/components/HomeAuth/keepWatchingSlide'
import ListCategories from '../../src/components/HomeAuth/listCategories'
import NewestCategory from '../../src/components/HomeAuth/newestCategory'
import HomeAuthPresentation from '../../src/components/HomeAuth/presentation'
import AOS from 'aos';
import 'aos/dist/aos.css';
import { useYear } from '../../src/components/HomeAuth/selectBox/yearProvider';
import FooterAuth from '../../src/components/HomeAuth/footerAuth';
import { useMenu } from '../../src/components/common/menu/menuProvider';
import styles from './styles.module.scss'
const HomeAuth = function () {
    const {selectedYear, onYearChange} = useYear()
    const { isMenuOpen } = useMenu();

    useEffect(() => {
        AOS.init(); 
        AOS.refresh();
    }, []); 

    return (
        <>
            <main className={`${styles.main} ${isMenuOpen ? styles.menuOpen : ""}`}>
                <HomeAuthPresentation/>
                <div className='pb-5'data-aos="fade-right" data-aos-duration="500" data-aos-offset="300">
                    <OnGoingCategory selectedYear={selectedYear} />
                    <NewestCategory selectedYear={selectedYear} />
                    <FavoriteCourses selectedYear={selectedYear} />
                    <FeaturedCategory selectedYear={selectedYear} />
                    <ListCategories selectedYear={selectedYear} />
                </div>
                <FooterAuth />
            </main>
        </>
    );
};

export default HomeAuth