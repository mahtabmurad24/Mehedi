'use client';

import { motion } from 'framer-motion';
import { useEffect, useState } from 'react';

export function ModernPreloader() {
  const [loading, setLoading] = useState(true);
  const [floatingElements, setFloatingElements] = useState<Array<{left: number, top: number, symbol: string, delay: number}>>([]);

  useEffect(() => {
    // Simulate loading time
    const timer = setTimeout(() => {
      setLoading(false);
    }, 2000);

    // Generate random positions for floating elements
    const elements = [1, 2, 3, 4, 5].map((i) => ({
      left: Math.random() * 100,
      top: Math.random() * 100,
      symbol: ['x', 'y', 'z', 'α', 'β', 'θ'][i - 1],
      delay: Math.random() * 2,
    }));
    setFloatingElements(elements);

    return () => clearTimeout(timer);
  }, []);

  if (!loading) return null;

  return (
    <div className="fixed inset-0 bg-gradient-to-br from-blue-50 via-white to-purple-50 flex items-center justify-center z-50">
      <div className="text-center">
        {/* Logo Animation */}
        <motion.div
          initial={{ scale: 0, rotate: -180 }}
          animate={{ scale: 1, rotate: 0 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="mb-8"
        >
          <div className="relative w-24 h-24 mx-auto">
            <img
              src="/logo.svg"
              alt="Mehedi's Math Academy"
              className="w-full h-full object-contain"
            />
          </div>
        </motion.div>

        {/* Mathematical Symbols Animation */}
        <div className="flex justify-center space-x-4 mb-8">
          {['∑', '∫', 'π', '∞', '√'].map((symbol, index) => (
            <motion.div
              key={symbol}
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: index * 0.1, duration: 0.5 }}
              className="text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-purple-600"
            >
              {symbol}
            </motion.div>
          ))}
        </div>

        {/* Loading Text */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5, duration: 0.5 }}
        >
          <h2 className="text-2xl font-bold text-gray-800 mb-2">
            Mehedi's Math Academy
          </h2>
          <p className="text-gray-600 mb-6">
            Preparing your learning experience...
          </p>
        </motion.div>

        {/* Animated Progress Bar */}
        <div className="w-64 mx-auto">
          <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: "100%" }}
              transition={{ duration: 1.5, ease: "easeInOut" }}
              className="h-full bg-gradient-to-r from-blue-600 to-purple-600 rounded-full"
            />
          </div>
        </div>

        {/* Floating Math Elements */}
        <div className="absolute inset-0 pointer-events-none overflow-hidden">
          {floatingElements.map((element, i) => (
            <motion.div
              key={i}
              className="absolute text-4xl opacity-10"
              style={{
                left: `${element.left}%`,
                top: `${element.top}%`,
              }}
              animate={{
                y: [0, -20, 0],
                rotate: [0, 5, -5, 0],
              }}
              transition={{
                duration: 3 + Math.random() * 2,
                repeat: Infinity,
                delay: element.delay,
              }}
            >
              {element.symbol}
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
}