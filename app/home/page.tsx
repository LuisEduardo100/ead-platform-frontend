'use client';
import { useEffect, useState } from 'react';
import FavoriteCourses from '../../src/components/HomeAuth/favoriteCategory'
import FeaturedCategory from '../../src/components/HomeAuth/featuredCategory'
import OnGoingCategory from '../../src/components/HomeAuth/keepWatchingSlide'
import ListCategories from '../../src/components/HomeAuth/listCategories'
import NewestCategory from '../../src/components/HomeAuth/newestCategory'
import HomeAuthPresentation from '../../src/components/HomeAuth/presentation'
import Footer from '../../src/components/common/footer'
import AOS from 'aos';
import 'aos/dist/aos.css';
import { useYear } from '../../src/components/HomeAuth/selectBox/yearProvider';

const HomeAuth = function () {
    const {selectedYear, onYearChange} = useYear()

    useEffect(() => {
        AOS.init(); 
        AOS.refresh();
    }, []); 

    return (
        <>
            <main>
                <HomeAuthPresentation selectedYear={selectedYear} onYearChange={onYearChange} />
                <div data-aos="fade-right" data-aos-duration="500" data-aos-offset="300">
                    <OnGoingCategory selectedYear={selectedYear} />
                    <NewestCategory selectedYear={selectedYear} />
                    <FavoriteCourses selectedYear={selectedYear} />
                    <FeaturedCategory selectedYear={selectedYear} />
                    <ListCategories selectedYear={selectedYear} />
                </div>
                <Footer />
            </main>
        </>
    );
};

export default HomeAuth