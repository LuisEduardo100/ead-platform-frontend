'use client';
import { useEffect } from 'react';
import PresentationSection from '../src/components/HomeNoAuth/presentation'
import HeaderNoAuth from '../src/components/HomeNoAuth/header'
import Footer from '../src/components/common/footer'
import styles from './styles/homeNoAuth.module.scss'
import AOS from "aos";
import "aos/dist/aos.css";
import HomeSlide from '../src/components/HomeNoAuth/homeNoAuthSlide/HomeSlide';


const HomeNoAuth = () => {
  useEffect(() => {
    AOS.init()
  }, [])

  return (
    <>
      <main className={styles.main}>
        <div className={styles.sectionBackground} data-aos="zoom-out-left" data-aos-duration="800" >
          <HeaderNoAuth />
          <PresentationSection />
        </div>
        <div className={styles.divPresentation} data-aos="fade-right" data-aos-duration="800" data-aos-easing="ease-in-sine">
          <HomeSlide />
        </div>
        <div className={styles.footer1}>
          <Footer />
        </div>
      </main>
    </>
  )
}


export default HomeNoAuth