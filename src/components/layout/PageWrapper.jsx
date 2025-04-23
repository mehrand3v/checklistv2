import { motion } from "framer-motion";

const pageVariants = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0, transition: { duration: 0.3 } },
  exit: { opacity: 0, y: -20, transition: { duration: 0.2 } },
};

export default function PageWrapper({ children, className = "" }) {
  return (
    <motion.div
      variants={pageVariants}
      initial="initial"
      animate="animate"
      exit="exit"
      className={`min-h-[calc(100vh-4rem)] w-full bg-gray-50 dark:bg-gray-900 ${className}`}
    >
      <div className="container mx-auto px-1 py-2">
        {children}
      </div>
    </motion.div>
  );
}