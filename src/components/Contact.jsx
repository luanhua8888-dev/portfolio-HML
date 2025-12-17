import { motion } from 'framer-motion';
import { FaEnvelope, FaPaperPlane } from 'react-icons/fa';

const Contact = () => {
    return (
        <section id="contact" className="py-24 pb-8">
            <div className="max-w-xl mx-auto px-6 text-center">
                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.6 }}
                >
                    <h2 className="text-4xl md:text-5xl font-bold mb-4">Get in <span className="gradient-text">Touch</span></h2>
                    <p className="text-slate-400 mb-10 text-lg">
                        Have a project in mind or just want to say hi? Feel free to contact me!
                    </p>
                </motion.div>

                <motion.div
                    className="p-10 rounded-3xl bg-dark/50 backdrop-blur-md border border-white/10 shadow-2xl"
                    initial={{ opacity: 0, scale: 0.9 }}
                    whileInView={{ opacity: 1, scale: 1 }}
                    viewport={{ once: true }}
                    transition={{ delay: 0.2, duration: 0.5 }}
                >
                    <div className="flex items-center justify-center gap-3 mb-8 text-secondary">
                        <FaEnvelope className="text-xl" />
                        <span className="text-lg font-medium">contact@example.com</span>
                    </div>

                    <form className="flex flex-col gap-5 text-left" onSubmit={(e) => e.preventDefault()}>
                        <div className="flex flex-col gap-2">
                            <label className="text-sm font-medium text-slate-300 ml-1">Name</label>
                            <input
                                type="text"
                                className="w-full bg-slate-900/60 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-secondary focus:bg-slate-900 transition-all placeholder:text-slate-600"
                                placeholder="Your Name"
                            />
                        </div>
                        <div className="flex flex-col gap-2">
                            <label className="text-sm font-medium text-slate-300 ml-1">Email</label>
                            <input
                                type="email"
                                className="w-full bg-slate-900/60 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-secondary focus:bg-slate-900 transition-all placeholder:text-slate-600"
                                placeholder="your.email@example.com"
                            />
                        </div>
                        <div className="flex flex-col gap-2">
                            <label className="text-sm font-medium text-slate-300 ml-1">Message</label>
                            <textarea
                                className="w-full bg-slate-900/60 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-secondary focus:bg-slate-900 transition-all placeholder:text-slate-600 min-h-[120px] resize-y"
                                placeholder="How can I help you?"
                            />
                        </div>

                        <button className="mt-4 w-full py-3 rounded-full bg-gradient-to-r from-secondary to-accent text-white font-bold flex items-center justify-center gap-2 hover:opacity-90 hover:scale-[1.02] transition-all shadow-lg shadow-indigo-500/20">
                            Send Message <FaPaperPlane className="text-sm" />
                        </button>
                    </form>
                </motion.div>

                <div className="mt-16 pt-8 border-t border-white/5 text-slate-500 text-sm">
                    &copy; {new Date().getFullYear()} Hua Minh Luan. All rights reserved.
                </div>
            </div>
        </section>
    );
};

export default Contact;
