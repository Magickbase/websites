import { Footer, Header } from '@magickbase-website/shared'
import { TailwindToaster } from '../components/Toaster'
import { Branding } from '../components/Branding'
import { AboutUs } from '../components/About'
import { ContactUs } from '../components/ContactUs'
import { Services } from '../components/Services'
import styles from './page.module.css'

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
      {/* TODO: Need to pass the serviceState. */}
      <Footer className="snap-always snap-center" />
      <TailwindToaster />
    </>
  )
}
