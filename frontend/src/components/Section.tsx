import { motion } from "framer-motion";
import { ReactNode } from "react";

interface SectionProps {
  title: string;
  id?: string;
  children: ReactNode;
}

const Section = ({ title, id, children }: SectionProps) => {
  return (
    <motion.section
      id={id}
      className="section-card"
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.2 }}
      transition={{ duration: 0.6 }}
    >
      <h2>{title}</h2>
      {children}
    </motion.section>
  );
};

export default Section;
