import { useRef } from 'react';
import { motion, useScroll, useTransform, useSpring, useMotionValue, useMotionTemplate } from 'framer-motion';
import { FaGithub, FaLinkedin, FaArrowDown } from 'react-icons/fa';

const Hero = () => {
    const ref = useRef(null);
    const { scrollYProgress } = useScroll({
        target: ref,
        offset: ["start start", "end start"]
    });

    // Parallax for background elements
    const backgroundY = useTransform(scrollYProgress, [0, 1], ["0%", "50%"]);
    const textY = useTransform(scrollYProgress, [0, 1], ["0%", "100%"]);

    // Mouse Tilt Effect
    const mouseX = useMotionValue(0);
    const mouseY = useMotionValue(0);

    const handleMouseMove = (e) => {
        const { clientX, clientY } = e;
        const { innerWidth, innerHeight } = window;
        const x = clientX / innerWidth - 0.5;
        const y = clientY / innerHeight - 0.5;
        mouseX.set(x);
        mouseY.set(y);
    };

    const rotateX = useSpring(useTransform(mouseY, [-0.5, 0.5], [15, -15]), { stiffness: 150, damping: 20 });
    const rotateY = useSpring(useTransform(mouseX, [-0.5, 0.5], [-15, 15]), { stiffness: 150, damping: 20 });

    return (
        <section
            ref={ref}
            onMouseMove={handleMouseMove}
            className="min-h-screen flex items-center justify-center relative overflow-hidden bg-transparent perspective-1000"
            id="home"
        >
            {/* Dynamic Grid Background Removed */}


            {/* Ambient Animated Blobs */}
            <motion.div
                style={{ y: backgroundY }}
                className="absolute top-[10%] left-[20%] w-[500px] h-[500px] bg-primary/20 rounded-full blur-[120px] mix-blend-screen pointer-events-none"
                animate={{ scale: [1, 1.2, 1], opacity: [0.3, 0.5, 0.3] }}
                transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
            />
            <motion.div
                style={{ y: backgroundY }}
                className="absolute bottom-[10%] right-[20%] w-[500px] h-[500px] bg-secondary/20 rounded-full blur-[120px] mix-blend-screen pointer-events-none"
                animate={{ scale: [1.2, 1, 1.2], opacity: [0.3, 0.5, 0.3] }}
                transition={{ duration: 8, repeat: Infinity, ease: "easeInOut", delay: 2 }}
            />

            {/* Main Content with 3D Tilt */}
            <motion.div
                style={{ rotateX, rotateY, y: textY, transformStyle: "preserve-3d" }}
                className="z-10 text-center px-4 max-w-5xl relative"
            >
                <motion.div
                    transformTemplate={({ rotateX, rotateY }) => `rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateZ(50px)`}
                    className="mb-8"
                >
                    <h2 className="text-xl md:text-2xl text-primary font-medium mb-4 tracking-widest uppercase opacity-80">
                        Hello, I am
                    </h2>

                    {/* Staggered Text Animation */}
                    <h1 className="text-6xl md:text-8xl font-black tracking-tight leading-none mb-6 text-white drop-shadow-2xl flex flex-wrap justify-center gap-x-4">
                        {Array.from("Hua Minh Luan").map((char, index) => (
                            <motion.span
                                key={index}
                                initial={{ opacity: 0, y: 100, rotateX: 90 }}
                                animate={{ opacity: 1, y: 0, rotateX: 0 }}
                                transition={{
                                    duration: 0.8,
                                    delay: 0.5 + index * 0.05,
                                    type: "spring",
                                    stiffness: 150
                                }}
                                className="inline-block origin-bottom text-transparent bg-clip-text bg-gradient-to-br from-white via-slate-200 to-slate-500"
                            >
                                {char === " " ? "\u00A0" : char}
                            </motion.span>
                        ))}
                    </h1>

                    <div className="h-1 w-24 bg-gradient-to-r from-primary to-secondary mx-auto rounded-full mb-8"></div>
                    <h3 className="text-2xl md:text-4xl text-slate-400 font-light mb-12 tracking-wide">
                        Frontend Developer
                    </h3>
                </motion.div>

                <motion.div
                    transformTemplate={({ rotateX, rotateY }) => `rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateZ(80px)`}
                    className="flex flex-col md:flex-row gap-6 justify-center items-center mb-16"
                >
                    <motion.a
                        href="#projects"
                        className="group relative px-8 py-4 rounded-full bg-slate-900 border border-slate-700 text-white font-bold overflow-hidden"
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                    >
                        <div className="absolute inset-0 w-full h-full bg-gradient-to-r from-primary to-accent opacity-0 group-hover:opacity-20 transition-opacity duration-300"></div>
                        <span className="relative z-10 flex items-center gap-2">
                            View Projects
                        </span>
                    </motion.a>

                    <motion.a
                        href="#contact"
                        className="group px-8 py-4 rounded-full bg-transparent border border-slate-600 text-slate-300 font-bold hover:border-primary hover:text-white transition-all"
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                    >
                        Contact Me
                    </motion.a>
                </motion.div>

                <div className="flex gap-8 justify-center">
                    <SocialLink href="https://github.com/luanhua8888-dev" icon={<FaGithub />} />
                    <SocialLink href="https://linkedin.com" icon={<FaLinkedin />} />
                </div>
            </motion.div>

            {/* Scroll Indicator */}
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 1, duration: 1 }}
                className="absolute bottom-10 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 text-slate-500"
            >
                <span className="text-xs tracking-widest uppercase">Scroll</span>
                <motion.div
                    animate={{ y: [0, 8, 0] }}
                    transition={{ repeat: Infinity, duration: 1.8, ease: "easeInOut" }}
                >
                    <FaArrowDown />
                </motion.div>
            </motion.div>
        </section>
    );
};

const SocialLink = ({ href, icon }) => (
    <motion.a
        href={href}
        target="_blank"
        className="text-3xl text-slate-400 hover:text-white transition-colors p-3 rounded-full hover:bg-white/5 border border-transparent hover:border-white/10 backdrop-blur-sm"
        whileHover={{ y: -5, scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
    >
        {icon}
    </motion.a>
);

export default Hero;
