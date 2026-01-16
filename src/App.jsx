import { useState } from 'react';
import { AnimatePresence } from 'framer-motion';
import { BrowserRouter, Routes, Route, useLocation } from 'react-router-dom';
import Section3D from './components/Section3D';
import Navbar from './components/Navbar';
import Hero from './components/Hero';
import About from './components/About';
import Projects from './components/Projects';
import Contact from './components/Contact';
import SmoothScroll from './components/SmoothScroll';
import CustomCursor from './components/CustomCursor';
import ParticlesBackground from './components/ParticlesBackground';
import Preloader from './components/Preloader';
import MusicPage from './components/Music/MusicPage';
import LearnPage from './components/Learn/LearnPage';

const Home = () => (
  <>
    <Hero />
    <Section3D>
      <About />
    </Section3D>
    <Section3D>
      <Projects />
    </Section3D>
    <Section3D>
      <Contact />
    </Section3D>
  </>
);

const AppContent = () => {
  const [isLoading, setIsLoading] = useState(true);
  const location = useLocation();

  return (
    <div className="bg-dark min-h-screen">
      <AnimatePresence mode="wait">
        {isLoading && <Preloader setIsLoading={setIsLoading} />}
      </AnimatePresence>

      {!isLoading && (
        <>
          <SmoothScroll />
          {/* Background persists across routes */}
          <ParticlesBackground />

          <Navbar />

          <AnimatePresence mode="wait">
            <Routes location={location} key={location.pathname}>
              <Route path="/" element={<Home />} />
              <Route path="/music" element={<MusicPage />} />
              <Route path="/learn" element={<LearnPage />} />
            </Routes>
          </AnimatePresence>
        </>
      )}
    </div>
  );
};

function App() {
  return (
    <BrowserRouter>
      <AppContent />
    </BrowserRouter>
  );
}

export default App;
