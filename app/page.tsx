'use client';
import { useEffect, useState } from 'react';
import PresentationSection from '../src/components/HomeNoAuth/presentation'
import HeaderNoAuth from '../src/components/HomeNoAuth/header'
import Footer from '../src/components/common/footer'
import styles from './styles/homeNoAuth.module.scss'
import AOS from "aos";
import "aos/dist/aos.css";
import HomeSlide from '../src/components/HomeNoAuth/homeNoAuthSlide/HomeSlide';
import profileService from '../src/services/profileService';
import PageSpinner from '../src/components/common/pageSpinner';
import { useRouter } from 'next/navigation';
import { useYear } from '../src/components/HomeAuth/selectBox/yearProvider';


const HomeNoAuth = () => {
  const router = useRouter()
  const [loading, setLoading] = useState(true)
  const {selectedYear, onYearChange} = useYear()

  useEffect(() => {
    AOS.init()
  }, [])

  useEffect(() => {
    if (!sessionStorage.getItem("vocenotadez-token")) {
        setLoading(false)
        router.push("/login");
    } 
}, [router])

useEffect(()=> {
    profileService.fetchCurrent().then((user)=>{
        onYearChange(user?.serie)
        setLoading(false)
    })
})

if (loading) return <PageSpinner/>

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