import { Footer } from '../components/Footer'
import { Header } from '../components/Header'
import { Branding } from '../components/Branding'
import { AboutUs } from '../components/About'
import { ContactUs } from '../components/ContactUs'
import { Services } from '../components/Services'

export default function Home() {
  return (
    <>
      <Header />
      <Branding className='snap-always snap-center'/>
      <AboutUs />
      <Services className='min-h-screen snap-always snap-center'/>
      <ContactUs className="h-screen snap-always snap-center"/>
      <Footer className="snap-always snap-center"/>
    </>
  )
}
