'use client'
import { useEffect } from 'react';
import PresentationSection from '../src/components/HomeNoAuth/apresentation'
import HeaderNoAuth from '../src/components/HomeNoAuth/header'
import Footer from '../src/components/common/footer'
import styles from './styles/homeNoAuth.module.scss'
import AOS from "aos";
import "aos/dist/aos.css";


const HomeNoAuth = () => {
  useEffect(()=>{
    AOS.init()
  }, [])
  return (
    <>
      <main >
        <div className={styles.sectionBackground} data-aos="zoom-out-left" data-aos-duration="800" >
          <HeaderNoAuth />
          <PresentationSection />
        </div>
        <Footer />
      </main>
    </>
  )
}

export default HomeNoAuth