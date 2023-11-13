import { Footer } from '../components/Footer'
import { Header } from '../components/Header'
import { Branding } from '../components/Branding'
import { AboutUs } from '../components/About'
import { ContactUs } from '../components/ContactUs'
import { Services } from '../components/Services'
import styles from './page.module.css'

export default function Home() {
  return (
    <div className='overflow-hidden'>
      <Header />
      <Branding />
      <div className={styles.separate}/>
      <AboutUs />
      <div className={styles.separate}/>
      <Services />
      <ContactUs />
      <Footer />
    </div>
  )
}
