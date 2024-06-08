import PresentationSection from '../src/components/HomeNoAuth/apresentation'
import HeaderNoAuth from '../src/components/HomeNoAuth/header'
import styles from './styles/homeNoAuth.module.scss'

const HomeNoAuth = () => {
  return (
    <>
      <main >
        <div className={styles.sectionBackground}>
          <HeaderNoAuth />
          <PresentationSection />
        </div>
      </main>
    </>
  )
}

export default HomeNoAuth