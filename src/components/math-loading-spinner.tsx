'use client';

import { motion } from 'framer-motion';

export function MathLoadingSpinner() {
  return (
    <div className="flex flex-col items-center justify-center space-y-4">
      {/* Rotating mathematical symbols */}
      <div className="relative w-16 h-16">
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
          className="absolute inset-0 flex items-center justify-center text-2xl font-bold text-blue-600"
        >
          ∑
        </motion.div>
        <motion.div
          animate={{ rotate: -360 }}
          transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
          className="absolute inset-0 flex items-center justify-center text-xl font-bold text-purple-600"
        >
          ∫
        </motion.div>
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 4, repeat: Infinity, ease: "linear" }}
          className="absolute inset-0 flex items-center justify-center text-lg font-bold text-pink-600"
        >
          π
        </motion.div>
      </div>
      
      {/* Animated dots */}
      <div className="flex space-x-2">
        {[1, 2, 3].map((i) => (
          <motion.div
            key={i}
            animate={{
              y: [0, -10, 0],
              opacity: [0.4, 1, 0.4],
            }}
            transition={{
              duration: 1,
              repeat: Infinity,
              delay: i * 0.2,
            }}
            className="w-2 h-2 bg-blue-600 rounded-full"
          />
        ))}
      </div>
      
      <motion.p
        animate={{ opacity: [0.6, 1, 0.6] }}
        transition={{ duration: 2, repeat: Infinity }}
        className="text-sm text-gray-600"
      >
        Calculating...
      </motion.p>
    </div>
  );
}