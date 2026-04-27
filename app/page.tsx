import { Navbar } from './components/layout/Navbar'
import { Footer } from './components/layout/Footer'
import { Hero } from './components/home/Hero'
import { AgeGate } from './components/gate/AgeGate'

export default function HomePage() {
  return (
    <>
      <AgeGate />
      <Navbar />
      <main className="pt-16">
        <Hero />
      </main>
      <Footer />
    </>
  )
}