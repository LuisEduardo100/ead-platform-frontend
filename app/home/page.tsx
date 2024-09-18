'use client';
import { useEffect } from 'react'
import FavoriteCourses from '../../src/components/HomeAuth/favoriteCategory'
import FeaturedCategory from '../../src/components/HomeAuth/featuredCategory'
import OnGoingCategory from '../../src/components/HomeAuth/keepWatchingSlide'
import KeepWatching from '../../src/components/HomeAuth/keepWatchingSlide'
import ListCategories from '../../src/components/HomeAuth/listCategories'
import NewestCategory from '../../src/components/HomeAuth/newestCategory'
import HomeAuthPresentation from '../../src/components/HomeAuth/presentation'
import Footer from '../../src/components/common/footer'
import { useRouter } from 'next/navigation';

const HomeAuth = function () {
    return (<>
        <main>
            <HomeAuthPresentation/>
            <OnGoingCategory/>
            <NewestCategory/>
            <FavoriteCourses/>
            <FeaturedCategory/>
            <ListCategories/>
            <Footer/>
        </main>
    </>)
}

export default HomeAuth