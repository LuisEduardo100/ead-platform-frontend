'use client';
import { useEffect } from 'react';
import PresentationSection from '../src/components/HomeNoAuth/presentation'
import HeaderNoAuth from '../src/components/HomeNoAuth/header'
import Footer from '../src/components/common/footer'
import styles from './styles/homeNoAuth.module.scss'
import AOS from "aos";
import "aos/dist/aos.css";
import HomeSlide from '../src/components/HomeNoAuth/HomeSlide';

const HomeNoAuth = () => {
  useEffect(() => {
    AOS.init()
  }, [])

  return (
    <>
      <main >
        <div className={styles.sectionBackground} data-aos="zoom-out-left" data-aos-duration="800" >
          <HeaderNoAuth />
          <PresentationSection />
        </div>
        <div data-aos="fade-right" data-aos-duration="1000" data-aos-easing="ease-in-sine">
          <HomeSlide />
        </div>
        <div data-aos="fade-left" data-aos-duration="1000" data-aos-easing="ease-in-sine">
          <HomeSlide />
        </div>
        <div data-aos="fade-right" data-aos-duration="1000" data-aos-easing="ease-in-sine">
          <HomeSlide />
        </div>
        <Footer />
      </main>
    </>
  )
}


export default HomeNoAuth