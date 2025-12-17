'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';
import { BookOpen, Mail, Phone, MapPin, Github, Twitter, Linkedin, Instagram, Facebook, Youtube } from 'lucide-react';

export function Footer() {
  const currentYear = new Date().getFullYear();

  const footerLinks = {
    company: [
      { name: 'About Us', href: '/about' },
      { name: 'Our Mission', href: '/mission' },
      { name: 'Success Stories', href: '/success-stories' },
      { name: 'Careers', href: '/careers' },
    ],
  };

  const socialLinks = [
    { name: 'Facebook', icon: Facebook, href: 'https://www.facebook.com/mehedismathacademy', color: 'hover:text-blue-600' },
    { name: 'Youtube', icon: Youtube, href: 'https://www.youtube.com/@mehedismathacademy', color: 'hover:text-red-500' },
    { name: 'Linkedin', icon: Linkedin, href: '#', color: 'hover:text-blue-600' },
    { name: 'Instagram', icon: Instagram, href: '#', color: 'hover:text-pink-600' },
  ];

  return (
    <footer className="relative bg-gradient-to-br from-gray-900 via-blue-900 to-purple-900 text-white overflow-hidden">
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-5">
        <div className="absolute inset-0" style={{
          backgroundImage: `radial-gradient(circle at 25% 25%, white 2px, transparent 2px), 
                             radial-gradient(circle at 75% 75%, white 2px, transparent 2px)`,
          backgroundSize: '30px 30px lg:50px lg:50px'
        }} />
      </div>

      {/* Mathematical Symbols Background */}
      <div className="absolute inset-0 pointer-events-none">
        {['∑', '∫', 'π', '∞', '√', 'Δ', 'Ω', 'λ'].map((symbol, index) => (
          <motion.div
            key={symbol}
            className="absolute text-4xl lg:text-6xl opacity-5 font-bold"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
            }}
            animate={{
              y: [0, -10, 0],
              opacity: [0.05, 0.1, 0.05],
            }}
            transition={{
              duration: 4 + Math.random() * 4,
              repeat: Infinity,
              delay: Math.random() * 2,
            }}
          >
            {symbol}
          </motion.div>
        ))}
      </div>

      <div className="relative z-10">
        {/* Main Footer Content */}
        <div className="px-4 sm:px-6 lg:px-8 py-12 lg:py-16">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 gap-8 lg:gap-12">
            {/* Brand Section */}
            <div className="md:col-span-2 lg:col-span-1 space-y-6">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                viewport={{ once: true }}
                className="flex items-center space-x-3"
              >
                <div className="relative w-10 h-10 lg:w-12 lg:h-12">
                  <div className="absolute inset-0 bg-gradient-to-br from-blue-400 to-purple-500 rounded-lg blur-sm opacity-75"></div>
                  <div className="relative bg-white rounded-lg p-1.5 lg:p-2">
                    <img
                      src="/logo.svg"
                      alt="Mehedi's Math Academy"
                      className="w-full h-full object-contain"
                    />
                  </div>
                </div>
                <div>
                  <h3 className="text-lg lg:text-xl font-bold bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
                    Mehedi's Math Academy
                  </h3>
                  <p className="text-xs lg:text-sm text-gray-300">Excellence in Mathematics Education</p>
                </div>
              </motion.div>

              <motion.p
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.1 }}
                viewport={{ once: true }}
                className="text-gray-300 leading-relaxed text-sm lg:text-base max-w-md"
              >
                Empowering students worldwide to master mathematics through expert guidance, 
                interactive learning, and personalized education paths.
              </motion.p>

              {/* Social Links */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.2 }}
                viewport={{ once: true }}
                className="flex space-x-3 lg:space-x-4"
              >
                {socialLinks.map((social) => (
                  <motion.a
                    key={social.name}
                    href={social.href}
                    target="_blank"
                    className={`p-1.5 lg:p-2 rounded-lg bg-white/10 backdrop-blur-sm border border-white/20 ${social.color} transition-all duration-300 hover:bg-white/20 hover:scale-110`}
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    <social.icon className="h-3 w-3 lg:h-4 lg:w-4" />
                  </motion.a>
                ))}
              </motion.div>
            </div>

            {/* Footer Links */}
            {Object.entries(footerLinks).map(([category, links], categoryIndex) => (
              <motion.div
                key={category}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.1 * categoryIndex }}
                viewport={{ once: true }}
                className="space-y-3 lg:space-y-4"
              >
                <h4 className="text-xs lg:text-sm font-semibold text-white uppercase tracking-wider">
                  {category.charAt(0).toUpperCase() + category.slice(1)}
                </h4>
                <ul className="space-y-2 lg:space-y-3">
                  {links.map((link, linkIndex) => (
                    <motion.li key={link.name} whileHover={{ x: 5 }}>
                      <Link
                        href={link.href}
                        className="text-gray-300 hover:text-white transition-colors duration-300 text-xs lg:text-sm flex items-center group"
                      >
                        <span className="transform transition-transform group-hover:scale-110">
                          {link.name}
                        </span>
                      </Link>
                    </motion.li>
                  ))}
                </ul>
              </motion.div>
            ))}
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-white/10">
          <div className="px-4 sm:px-6 lg:px-8 py-4 lg:py-6">
            <div className="flex flex-col lg:flex-row items-center justify-between space-y-4 lg:space-y-0">
              <motion.div
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                transition={{ duration: 0.5 }}
                viewport={{ once: true }}
                className="text-xs lg:text-sm text-gray-400 text-center lg:text-left max-w-full lg:max-w-none"
              >
                © {currentYear} Mehedi's Math Academy. All rights reserved. 
                <span className="mx-1 lg:mx-2">•</span>
                Made with <span className="text-red-500">♥</span> for mathematics education
              </motion.div>

              <motion.div
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                transition={{ duration: 0.5, delay: 0.2 }}
                viewport={{ once: true }}
                className="flex flex-col sm:flex-row items-center space-y-2 sm:space-y-0 sm:space-x-4 lg:space-x-6 text-xs lg:text-sm text-gray-400"
              >
                <div className="flex items-center space-x-1">
                  <BookOpen className="h-3 w-3 lg:h-4 lg:w-4 text-blue-400" />
                  <span>500+ Courses</span>
                </div>
                <div className="flex items-center space-x-1">
                  <span className="text-green-400 text-xs lg:text-sm">•</span>
                  <span>10,000+ Students</span>
                </div>
                <div className="flex items-center space-x-1">
                  <span className="text-purple-400 text-xs lg:text-sm">•</span>
                  <span>98% Success Rate</span>
                </div>
              </motion.div>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}