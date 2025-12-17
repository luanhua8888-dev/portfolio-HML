import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FaChevronRight, FaChevronLeft, FaHome, FaUser, FaCode, FaEnvelope, FaFileDownload, FaMusic } from 'react-icons/fa';
import { Link, useLocation } from 'react-router-dom';
import Magnetic from './Magnetic';

const Navbar = () => {
  const [isExpanded, setIsExpanded] = useState(true); // Default to open
  const [scrolled, setScrolled] = useState(false);
  const location = useLocation();

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navLinks = [
    { name: 'Home', href: '/#home', icon: <FaHome /> },
    { name: 'About', href: '/#about', icon: <FaUser /> },
    { name: 'Projects', href: '/#projects', icon: <FaCode /> },
    { name: 'Music', href: '/music', icon: <FaMusic /> }, // Internal Route
    { name: 'Contact', href: '/#contact', icon: <FaEnvelope /> },
  ];

  return (
    <div className="fixed top-6 left-1/2 -translate-x-1/2 z-50 flex justify-center">
      <motion.nav
        layout
        initial={{ width: 'auto', opacity: 0, y: -20 }}
        animate={{
          opacity: 1,
          y: 0,
          width: 'auto',
        }}
        transition={{
          type: "spring",
          stiffness: 300,
          damping: 30
        }}
        className={`
            relative flex items-center p-2 rounded-full border 
            backdrop-blur-xl transition-colors duration-300 overflow-hidden
            ${scrolled
            ? 'bg-[#0f172a]/90 border-slate-700 shadow-xl shadow-black/40'
            : 'bg-[#0f172a]/70 border-white/10'
          }
        `}
      >
        {/* Logo Section - Always Visible */}
        <Link
          to="/"
          className="flex items-center gap-2 px-4 py-2 shrink-0 group"
        >
          <motion.div layout="position" className="w-2.5 h-2.5 rounded-full bg-indigo-500 animate-pulse shadow-[0_0_10px_rgba(99,102,241,0.5)]" />
          <motion.span layout="position" className="font-bold text-slate-100 tracking-wide text-sm">HML</motion.span>
        </Link>

        {/* Divider */}
        <AnimatePresence>
          {isExpanded && (
            <motion.div
              initial={{ opacity: 0, scaleY: 0 }}
              animate={{ opacity: 1, scaleY: 1 }}
              exit={{ opacity: 0, scaleY: 0 }}
              transition={{ duration: 0.2 }}
              className="w-[1px] h-4 bg-slate-700/50 mx-1 shrink-0"
            />
          )}
        </AnimatePresence>

        {/* Links Section - Collapsible */}
        <div className="flex items-center overflow-hidden">
          <AnimatePresence mode="popLayout">
            {isExpanded && (
              <motion.div
                initial={{ opacity: 0, width: 0 }}
                animate={{ opacity: 1, width: 'auto' }}
                exit={{ opacity: 0, width: 0 }}
                transition={{
                  opacity: { duration: 0.2 },
                  width: { duration: 0.4, type: "spring", bounce: 0, stiffness: 200, damping: 25 },
                }}
                className="flex items-center gap-1 overflow-hidden"
              >
                {navLinks.map((link) => {
                  const isInternal = !link.href.startsWith('#') && !link.href.startsWith('http') && !link.href.includes('/#');
                  // We treat /# as external 'a' tag for now to let browser handle hash jump from root, 
                  // or we can use Link to="/" if we are fancy, but simple `a` works robustly for hash links.
                  // Actually, to avoid full reload, for /# we can use standard anchor or hashlink.
                  // Let's us Link for /music and `a` for hashes.

                  const Component = isInternal ? Link : 'a';
                  const props = isInternal ? { to: link.href } : { href: link.href };
                  // Check if active
                  const isActive = location.pathname === link.href;

                  return (
                    <Magnetic key={link.name}>
                      <Component
                        {...props}
                        className={`relative group px-3 py-2 md:px-4 md:py-2 flex items-center gap-2 text-sm font-medium transition-colors rounded-full whitespace-nowrap ${isActive ? 'text-white bg-white/10' : 'text-slate-400 hover:text-white hover:bg-white/5'
                          }`}
                      >
                        {/* Icon for Mobile */}
                        <span className="block md:hidden text-lg">{link.icon}</span>
                        {/* Text for Desktop */}
                        <span className="hidden md:block">{link.name}</span>

                        {isActive && <motion.span layoutId="nav-glow" className="absolute inset-0 rounded-full bg-white/5 -z-10" />}
                      </Component>
                    </Magnetic>
                  )
                })}

                {/* Resume Button */}
                <div className="pl-2 border-l border-slate-700/50 ml-2 mr-2">
                  <Magnetic>
                    <a
                      href="/CV_HuaMinhLuan_FrontEnd.pdf"
                      target="_blank"
                      className="flex items-center gap-2 px-3 py-2 md:px-4 md:py-2 rounded-full bg-indigo-600/10 border border-indigo-500/30 text-indigo-300 text-xs font-bold uppercase tracking-wider hover:bg-indigo-600 hover:text-white transition-all whitespace-nowrap"
                    >
                      <FaFileDownload className="text-sm" />
                      <span className="hidden md:block">Resume</span>
                    </a>
                  </Magnetic>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Toggle Button */}
        <motion.button
          layout="position"
          onClick={() => setIsExpanded(!isExpanded)}
          className="ml-1 w-8 h-8 flex items-center justify-center rounded-full text-slate-400 hover:text-white hover:bg-white/10 transition-colors shrink-0 z-10"
          whileTap={{ scale: 0.9 }}
          aria-label={isExpanded ? "Collapse Menu" : "Expand Menu"}
        >
          {isExpanded ? <FaChevronRight size={12} /> : <FaChevronLeft size={12} />}
        </motion.button>

      </motion.nav>
    </div>
  );
};

export default Navbar;
