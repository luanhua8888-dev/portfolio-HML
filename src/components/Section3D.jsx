import { useRef } from "react";
import { motion, useScroll, useTransform } from "framer-motion";

const Section3D = ({ children, className }) => {
    return (
        <motion.section
            initial={{ opacity: 0, y: 100, scale: 0.95, rotateX: 10 }}
            whileInView={{ opacity: 1, y: 0, scale: 1, rotateX: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.8, type: "spring", bounce: 0.2 }}
            className={`perspective-1000 my-16 ${className}`}
        >
            {children}
        </motion.section>
    );
};

export default Section3D;
