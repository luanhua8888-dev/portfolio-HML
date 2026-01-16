import { motion } from 'framer-motion';
import { FaEnvelope, FaBook, FaPhone, FaLinkedin, FaGithub, FaExternalLinkAlt } from 'react-icons/fa';
import { Link } from 'react-router-dom';

const BentoCard = ({ link, className, index }) => {
    const isExternal = !link.href.startsWith('mailto:') && !link.href.startsWith('tel:');

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: index * 0.1, duration: 0.8 }}
            className={className}
        >
            <a
                href={link.href}
                target={isExternal ? "_blank" : "_self"}
                rel={isExternal ? "noopener noreferrer" : undefined}
                className="group relative flex h-full w-full flex-col justify-between overflow-hidden rounded-[2rem] border border-white/5 bg-slate-900/40 p-8 backdrop-blur-xl transition-all duration-500 hover:border-indigo-500/30 hover:bg-slate-900/60"
            >
                <div className="relative z-10 flex h-full flex-col justify-between">
                    <div className="flex items-start justify-between">
                        <div className={`rounded-2xl bg-white/5 p-4 text-3xl transition-all duration-500 group-hover:scale-110 group-hover:bg-indigo-500/10 ${link.color}`}>
                            {link.icon}
                        </div>
                        {isExternal && <FaExternalLinkAlt className="text-slate-700 opacity-0 transition-all duration-500 group-hover:opacity-100 group-hover:text-indigo-500" />}
                    </div>

                    <div>
                        <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-slate-500 transition-colors group-hover:text-indigo-400">
                            {link.label}
                        </p>
                        <h3 className="mt-2 text-2xl font-bold text-white tracking-tight">
                            {link.value}
                        </h3>
                    </div>
                </div>

                {/* Subtle Gradient Glow */}
                <div className="absolute -right-20 -top-20 h-64 w-64 rounded-full bg-indigo-500/5 blur-[80px] transition-all duration-700 group-hover:bg-indigo-500/10 group-hover:blur-[60px]" />
            </a>
        </motion.div>
    );
};

const Contact = () => {
    const contactLinks = [
        {
            icon: <FaEnvelope />,
            label: "Email",
            value: "luanhua8888@gmail.com",
            href: "mailto:luanhua8888@gmail.com",
            color: "text-blue-400",
            size: "lg:col-span-2 lg:row-span-1"
        },
        {
            icon: <FaPhone />,
            label: "Phone",
            value: "0775 968 578",
            href: "tel:0775968578",
            color: "text-emerald-400",
            size: "lg:col-span-1 lg:row-span-1"
        },
        {
            icon: <FaGithub />,
            label: "GitHub",
            value: "luanhua8888-dev",
            href: "https://github.com/luanhua8888-dev",
            color: "text-slate-300",
            size: "lg:col-span-1 lg:row-span-2"
        },
        {
            icon: <FaLinkedin />,
            label: "LinkedIn",
            value: "Hua Minh Luan",
            href: "https://www.linkedin.com/in/luanhua8888/",
            color: "text-indigo-400",
            size: "lg:col-span-3 lg:row-span-1"
        }
    ];

    return (
        <section id="contact" className="relative py-32 overflow-hidden bg-black/20">
            {/* Elegant Background Gradient */}
            <div className="absolute inset-0 pointer-events-none">
                <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-[1px] bg-gradient-to-r from-transparent via-indigo-500/20 to-transparent" />
                <div className="absolute -top-[20%] left-1/2 -translate-x-1/2 w-[800px] h-[500px] bg-indigo-600/5 blur-[120px] rounded-full" />
            </div>

            <div className="mx-auto max-w-7xl px-6">
                <div className="mb-20 text-center">
                    <motion.span
                        initial={{ opacity: 0 }}
                        whileInView={{ opacity: 1 }}
                        className="text-[10px] font-black uppercase tracking-[0.5em] text-indigo-500/80"
                    >
                        Contact
                    </motion.span>
                    <motion.h2
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.1 }}
                        className="mt-4 text-5xl md:text-7xl font-bold tracking-tighter text-white"
                    >
                        Let's build <span className="bg-gradient-to-r from-indigo-400 to-indigo-600 bg-clip-text text-transparent">together.</span>
                    </motion.h2>
                    <motion.p
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.2 }}
                        className="mx-auto mt-6 max-w-2xl text-lg text-slate-400 font-medium leading-relaxed"
                    >
                        Minimalist interaction, maximum impact. Reach out through any channel below for collaborations or inquiries.
                    </motion.p>
                </div>

                <div className="grid grid-cols-1 gap-6 lg:grid-cols-4 lg:grid-rows-2">
                    {contactLinks.map((link, index) => (
                        <BentoCard
                            key={index}
                            link={link}
                            index={index}
                            className={link.size}
                        />
                    ))}
                </div>

                <motion.div
                    initial={{ opacity: 0 }}
                    whileInView={{ opacity: 1 }}
                    viewport={{ once: true }}
                    className="mt-24 flex flex-col items-center justify-between gap-8 border-t border-white/5 pt-12 text-center md:flex-row md:text-left"
                >
                    <div className="space-y-2">
                        <Link
                            to="/learn"
                            className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-slate-500 transition-colors hover:text-indigo-400"
                        >
                            <FaBook className="text-indigo-500/50" /> Learn - Practice Hub
                        </Link>
                        <p className="text-sm text-slate-600">
                            &copy; {new Date().getFullYear()} Hua Minh Luan. All rights reserved.
                        </p>
                    </div>

                    <div className="h-12 w-[1px] bg-white/5 hidden md:block" />

                    <div className="flex items-center gap-6">
                        <div className="text-right">
                            <p className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-500">Status</p>
                            <p className="flex items-center gap-2 text-sm font-bold text-white">
                                <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.6)] animate-pulse" />
                                Available for Projects
                            </p>
                        </div>
                    </div>
                </motion.div>
            </div>
        </section>
    );
};

export default Contact;
