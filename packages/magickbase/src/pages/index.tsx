import { Footer } from '../components/Footer'
import { Header } from '../components/Header'
import { Branding } from '../components/Branding'
import { AboutUs } from '../components/About'
import { ContactUs } from '../components/ContactUs'
import { Services } from '../components/Services'
import styles from './page.module.css'
import { TailwindToaster } from '@/components/Toaster'

export default function Home() {
  return (
    <>
      <Header />
      <Branding id="branding" className="snap-always snap-center" />
      <div className={styles.separate} />
      <AboutUs />
      <div className={styles.separate} />
      <Services className="min-h-screen snap-always snap-center" />
      <div className={styles.separate} />
      <ContactUs className="min-h-screen snap-always snap-center" />
      <Footer className="snap-always snap-center" />
      <TailwindToaster />
    </>
  )
}
