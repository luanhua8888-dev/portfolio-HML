import { motion } from 'framer-motion';
import { FaGithub, FaExternalLinkAlt, FaCode } from 'react-icons/fa';

const Projects = () => {
    const projects = [
        {
            title: "E-Commerce Dashboard",
            description: "A comprehensive dashboard for managing online stores, featuring real-time analytics, inventory management, and order processing.",
            tags: ["React", "Chart.js", "Node.js", "MongoDB"],
            github: "#",
            demo: "#"
        },
        {
            title: "Social Media App",
            description: "A responsive social media platform allowing users to share posts, like, comment, and connect with others in real-time.",
            tags: ["Vue.js", "Firebase", "TailwindCSS"],
            github: "#",
            demo: "#"
        },
        {
            title: "Portfolio Website",
            description: "A personal portfolio website showcasing skills and projects with modern animations and responsive design.",
            tags: ["React", "Framer Motion", "Vite"],
            github: "#",
            demo: "#"
        }
    ];

    return (
        <section id="projects" className="py-24">
            <div className="max-w-7xl mx-auto px-6">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    className="text-center mb-16"
                >
                    <h2 className="text-4xl md:text-5xl font-bold mb-4">
                        Featured <span className="gradient-text">Projects</span>
                    </h2>
                    <p className="text-slate-400 text-lg">
                        A selection of my recent work
                    </p>
                </motion.div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
                    {projects.map((project, index) => (
                        <motion.div
                            key={index}
                            className="bg-dark-card border border-white/10 rounded-2xl overflow-hidden hover:-translate-y-2 hover:shadow-2xl hover:border-secondary/30 transition-all duration-300 flex flex-col group"
                            initial={{ opacity: 0, y: 30 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            transition={{ delay: index * 0.1, duration: 0.5 }}
                            viewport={{ once: true }}
                        >
                            <div className="h-56 bg-slate-800 relative overflow-hidden group-hover:scale-105 transition-transform duration-500">
                                {/* Placeholder for project image */}
                                <div className="w-full h-full bg-gradient-to-tr from-slate-800 to-slate-700 flex items-center justify-center text-4xl text-slate-500">
                                    <FaCode />
                                </div>
                            </div>
                            <div className="p-8 flex-1 flex flex-col">
                                <h3 className="text-2xl font-bold mb-3 text-slate-100 group-hover:text-primary transition-colors">{project.title}</h3>
                                <p className="text-slate-400 mb-6 leading-relaxed text-sm flex-grow">{project.description}</p>
                                <div className="flex flex-wrap gap-2 mb-6">
                                    {project.tags.map(tag => (
                                        <span key={tag} className="px-3 py-1 rounded-full bg-primary/10 text-primary text-xs font-semibold">{tag}</span>
                                    ))}
                                </div>
                                <div className="flex gap-6 mt-auto">
                                    <a href={project.github} target="_blank" rel="noopener noreferrer" className="text-slate-400 hover:text-white text-xl transition-colors" title="View Code">
                                        <FaGithub />
                                    </a>
                                    <a href={project.demo} target="_blank" rel="noopener noreferrer" className="text-slate-400 hover:text-white text-xl transition-colors" title="View Demo">
                                        <FaExternalLinkAlt />
                                    </a>
                                </div>
                            </div>
                        </motion.div>
                    ))}
                </div>
            </div>
        </section>
    );
};

export default Projects;
