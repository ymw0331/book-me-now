import { motion } from 'framer-motion';
import { Container } from '../layout';

export default function Jumbotron({
  title,
  subTitle = "Discover and book amazing services from trusted providers"
}) {
  return (
    <div className="jumbotron relative flex items-center justify-center">
      {/* Background overlay */}
      <div className="absolute inset-0 bg-black/20" />
      
      {/* Content */}
      <Container className="relative z-10">
        <motion.div 
          className="text-center py-16"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          <motion.h1 
            className="text-4xl sm:text-5xl lg:text-6xl font-bold text-white mb-6"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2, duration: 0.8 }}
          >
            {title}
          </motion.h1>
          <motion.p 
            className="text-lg sm:text-xl text-white/90 max-w-3xl mx-auto leading-relaxed"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4, duration: 0.8 }}
          >
            {subTitle}
          </motion.p>
        </motion.div>
      </Container>
    </div>
  );
}