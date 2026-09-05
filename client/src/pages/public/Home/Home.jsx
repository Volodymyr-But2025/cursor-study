import { useEffect } from 'react'
import { useLocation } from 'react-router-dom'
import { Navbar, Footer } from '@/components'
import { scrollToTop } from '@/utils/helpers'
import { Header, BlogList, NewsletterForm } from './components'

function Home() {
  const location = useLocation()

  useEffect(() => {
    if (location.hash === '#articles') {
      const frameId = window.requestAnimationFrame(() => {
        document.getElementById('articles')?.scrollIntoView({ behavior: 'smooth' })
      })
      return () => window.cancelAnimationFrame(frameId)
    }

    scrollToTop('auto')
  }, [location.hash, location.key])

  return (
    <>
      <Navbar />
      <Header />
      <BlogList />
      <NewsletterForm />
      <Footer />
    </>
  )
}

export default Home
