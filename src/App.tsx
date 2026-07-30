import Header from "./components/Header"
import Hero from "./components/Hero"
import About from "./components/About"
import Services from "./components/Services"
import Skills from "./components/Skills"
import Experience from "./components/Experience"
import Projects from "./components/Projects"
import Education from "./components/Education"
import Contact from "./components/Contact"
import Footer from "./components/Footer"
import BackToTop from "./components/BackToTop"
import ScrollProgress from "./components/ScrollProgress"
import Spotlight from "./components/Spotlight"
import SectionDivider from "./components/SectionDivider"

function App() {
  return (
    <>
      <ScrollProgress />
      <Spotlight />
      <Header />
      <main className="relative z-10">
        <Hero />
        <About />
        <SectionDivider />
        <Services />
        <SectionDivider />
        <Skills />
        <SectionDivider />
        <Experience />
        <SectionDivider />
        <Projects />
        <SectionDivider />
        <Education />
        <SectionDivider />
        <Contact />
      </main>
      <Footer />
      <BackToTop />
    </>
  )
}

export default App
