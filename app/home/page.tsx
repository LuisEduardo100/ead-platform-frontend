import FavoriteCourses from '../../src/components/HomeAuth/favoriteCategory'
import FeaturedCategory from '../../src/components/HomeAuth/featuredCategory'
import ListCategories from '../../src/components/HomeAuth/listCategories'
import NewestCategory from '../../src/components/HomeAuth/newestCategory'
import HomeAuthPresentation from '../../src/components/HomeAuth/presentation'
import Footer from '../../src/components/common/footer'

const HomeAuth = function () {
    return (<>
        <main>
            <HomeAuthPresentation/>
            <NewestCategory/>
            <FavoriteCourses/>
            <FeaturedCategory/>
            <ListCategories/>
            <Footer/>
        </main>
    </>)
}

export default HomeAuth