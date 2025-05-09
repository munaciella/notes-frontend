'use client';

import { ReactNode } from 'react';
import { motion } from 'framer-motion';

interface LayoutProps {
  sidebar: ReactNode;
  children: ReactNode;
}

export function TwoPaneLayout({ sidebar, children }: LayoutProps) {
  return (
    <div className="flex h-screen overflow-hidden">
      {/* DESKTOP ONLY */}
      <aside className="hidden md:flex w-80 border-r border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.4 }}
          className="h-full overflow-y-auto"
        >
          {sidebar}
        </motion.div>
      </aside>

      {/* MAIN & MOBILE SHEET */}
      <main className="relative flex-1 bg-gray-50 dark:bg-gray-800 overflow-y-auto">
        {/* MOBILE: render the sheet trigger/drawer here */}
        <div className="md:hidden">
          {sidebar}
        </div>

        {/* Your actual page content */}
        <motion.div
          initial={{ x: 20, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          transition={{ duration: 0.4 }}
          className="p-6"
        >
          {children}
        </motion.div>
      </main>
    </div>
  );
}
