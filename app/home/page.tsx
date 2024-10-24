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
import profileService from '../../src/services/profileService';
import PageSpinner from '../../src/components/common/pageSpinner';

const HomeAuth = function () {
    const [selectedYear, setSelectedYear] = useState('6º ano'); 
    const [loading, setLoading] = useState(true); 

    const fetchUserData = async () => {
        try {
            const data = await profileService.fetchCurrent();
            if (data?.serie) {
                setSelectedYear(data.serie);
            }
        } catch (error) {
            console.error("Erro ao buscar os dados do usuário:", error);
        } finally {
            setLoading(false); 
        }
    };

    useEffect(() => {
        fetchUserData(); 
        AOS.init(); 
        AOS.refresh();
    }, []); 

    if (loading) {
        return <PageSpinner/> 
    }
    return (
        <>
            <main>
                <HomeAuthPresentation selectedYear={selectedYear} onYearChange={setSelectedYear} />
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