'use client';
import { useState } from 'react';
import FavoriteCourses from '../../src/components/HomeAuth/favoriteCategory'
import FeaturedCategory from '../../src/components/HomeAuth/featuredCategory'
import OnGoingCategory from '../../src/components/HomeAuth/keepWatchingSlide'
import ListCategories from '../../src/components/HomeAuth/listCategories'
import NewestCategory from '../../src/components/HomeAuth/newestCategory'
import HomeAuthPresentation from '../../src/components/HomeAuth/presentation'
import Footer from '../../src/components/common/footer'

const HomeAuth = function () {
    const [selectedYear, setSelectedYear] = useState('6º ano'); // Valor padrão é o 6º ano

    return (
        <>
            <main>
                {/* Passa o estado do ano selecionado e a função de atualização para HomeAuthPresentation */}
                <HomeAuthPresentation selectedYear={selectedYear} onYearChange={setSelectedYear} />
                {/* Passa o selectedYear para os outros componentes */}
                <OnGoingCategory selectedYear={selectedYear} />
                <NewestCategory selectedYear={selectedYear} />
                <FavoriteCourses selectedYear={selectedYear} />
                <FeaturedCategory selectedYear={selectedYear} />
                <ListCategories selectedYear={selectedYear} />
                <Footer />
            </main>
        </>
    );
};

export default HomeAuth