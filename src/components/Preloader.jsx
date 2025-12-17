import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

const Preloader = ({ setIsLoading }) => {
    const [count, setCount] = useState(0);

    useEffect(() => {
        const timer = setInterval(() => {
            setCount((prev) => {
                if (prev === 100) {
                    clearInterval(timer);
                    setTimeout(() => setIsLoading(false), 800);
                    return 100;
                }
                return prev + 1;
            });
        }, 20);

        return () => clearInterval(timer);
    }, [setIsLoading]);

    return (
        <motion.div
            className="fixed inset-0 z-[99999] flex flex-col items-center justify-center bg-dark text-slate-100 overflow-hidden"
            exit={{ y: "-100%", transition: { duration: 0.8, ease: [0.76, 0, 0.24, 1] } }}
        >
            {/* Background ambient glow */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[50vh] h-[50vh] bg-primary/20 rounded-full blur-[100px] animate-pulse"></div>

            <div className="z-10 flex flex-col items-center">
                <motion.p
                    className="text-8xl md:text-9xl font-black tabular-nums mb-4 bg-clip-text text-transparent bg-gradient-to-b from-white to-slate-500"
                    initial={{ opacity: 0, y: 50 }}
                    animate={{ opacity: 1, y: 0 }}
                >
                    {count}%
                </motion.p>
                <motion.div
                    className="h-1 bg-slate-800 w-64 rounded-full overflow-hidden"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.5 }}
                >
                    <motion.div
                        className="h-full bg-gradient-to-r from-primary to-accent"
                        style={{ width: `${count}%` }}
                    />
                </motion.div>
                <motion.p
                    className="mt-4 text-slate-500 text-sm uppercase tracking-[0.2em]"
                    animate={{ opacity: [0.5, 1, 0.5] }}
                    transition={{ repeat: Infinity, duration: 2 }}
                >
                    Loading Experience
                </motion.p>
            </div>
        </motion.div>
    );
};

export default Preloader;
