import { GetServerSideProps } from 'next';
import { Footer, Header } from '@magickbase-website/shared'
import { serverSideTranslations } from "next-i18next/serverSideTranslations";
import { TailwindToaster } from '../components/Toaster'
import { Branding } from '../components/Branding'
import { AboutUs } from '../components/About'
import { ContactUs } from '../components/ContactUs'
import { Services } from '../components/Services'
import styles from './page.module.css'
import { api } from '../utils/api'

export const getServerSideProps: GetServerSideProps = async ({
  locale,
}) => ({
  props: {
    ...(await serverSideTranslations(locale ?? "en", ["common"])),
  },
});


export default function Home() {
  const aggregateStateQuery = api.uptime.aggregateState.useQuery()

  return (
    <>
      <Header className="z-10" />
      <Branding id="branding" className="snap-always snap-center z-0" />
      <div className={styles.separate} />
      <AboutUs />
      <div className={styles.separate} />
      <Services className="min-h-screen snap-always snap-center" />
      <div className={styles.separate} />
      <ContactUs className="min-h-screen snap-always snap-center z-0" />
      <Footer className="snap-always snap-center" serviceState={aggregateStateQuery.data} />
      <TailwindToaster />
    </>
  )
}
