import FavoriteCourses from '../../src/components/HomeAuth/favoriteCategory'
import HeaderAuth from '../../src/components/HomeAuth/header'
import NewestCategory from '../../src/components/HomeAuth/newestCategory'
import HomeAuthPresentation from '../../src/components/HomeAuth/presentation'
import styles from '../styles/homeAuth.module.scss'

const HomeAuth = function () {
    return (<>
        <main>
            <HomeAuthPresentation/>
            <NewestCategory/>
            <FavoriteCourses/>
        </main>
    </>)
}

export default HomeAuth