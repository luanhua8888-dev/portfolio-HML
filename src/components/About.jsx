import { motion } from 'framer-motion';

const About = () => {
    const skills = [
        "HTML5", "CSS3", "JavaScript (ES6+)",
        "React.js", "Redux", "Hooks",
        "Vite", "Bootstrap", "Git",
        "TailwindCSS", "Figma", "Responsive Design"
    ];

    return (
        <section id="about" className="py-24 relative">
            <div className="max-w-7xl mx-auto px-6">
                <motion.div
                    initial={{ opacity: 0, y: 50 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6 }}
                    viewport={{ once: true }}
                    className="grid grid-cols-1 md:grid-cols-2 gap-16 items-center"
                >
                    <div>
                        <h2 className="text-4xl md:text-5xl font-bold mb-8">About <span className="gradient-text">Me</span></h2>
                        <div className="text-slate-300 text-lg leading-relaxed space-y-6">
                            <p>
                                Hello! I'm <strong>Hua Minh Luan</strong>, a passionate Frontend Developer dedicated to creating
                                visually stunning and highly functional web applications. With a keen eye for design
                                and a strong command of modern web technologies, I transform ideas into seamless digital experiences.
                            </p>
                            <p>
                                My journey in web development is driven by a desire to build intuitive user interfaces
                                that delight users. I constantly explore new tools and frameworks to stay ahead in the
                                ever-evolving tech landscape.
                            </p>
                        </div>

                        <div className="flex flex-wrap gap-3 mt-8">
                            {skills.map((skill, index) => (
                                <motion.span
                                    key={index}
                                    className="px-4 py-2 rounded-full bg-white/5 border border-white/10 text-secondary text-sm font-medium hover:bg-secondary/10 hover:border-secondary hover:-translate-y-1 transition-all cursor-default"
                                    initial={{ opacity: 0, scale: 0.8 }}
                                    whileInView={{ opacity: 1, scale: 1 }}
                                    transition={{ delay: index * 0.05 }}
                                    viewport={{ once: true }}
                                >
                                    {skill}
                                </motion.span>
                            ))}
                        </div>
                    </div>

                    <div className="grid grid-cols-2 gap-6">
                        {[
                            { number: "2+", label: "Years Experience" },
                            { number: "20+", label: "Projects Completed" },
                            { number: "100%", label: "Client Satisfaction" },
                            { number: "∞", label: "Learning" }
                        ].map((stat, idx) => (
                            <div key={idx} className="p-6 rounded-2xl bg-white/5 border border-white/5 text-center hover:bg-white/10 transition-colors">
                                <span className="block text-4xl font-bold text-accent mb-2">{stat.number}</span>
                                <span className="text-sm text-slate-400">{stat.label}</span>
                            </div>
                        ))}
                    </div>
                </motion.div>
            </div>
        </section>
    );
};

export default About;
