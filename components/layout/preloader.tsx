"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";

/**
 * Show the preloader only on the very first visit to the site.
 * Once loaded, we set a sessionStorage flag so subsequent navigations skip it.
 */
export default function Preloader() {
  const [loadingProgress, setLoadingProgress] = useState(0);
  const [isLoaded, setIsLoaded] = useState(false);
  const [shouldShow, setShouldShow] = useState(false);

  useEffect(() => {
    // Only show preloader on the first page load in this session
    if (typeof window !== "undefined") {
      const hasLoaded = sessionStorage.getItem("hcu_preloaded");
      if (hasLoaded) {
        setIsLoaded(true);
        return;
      }
      setShouldShow(true);
    }
  }, []);

  useEffect(() => {
    if (!shouldShow) return;

    let progress = 0;
    const interval = setInterval(() => {
      progress += Math.random() * 15;
      if (progress > 100) {
        progress = 100;
      }
      setLoadingProgress(progress);

      if (progress === 100) {
        clearInterval(interval);
        setTimeout(() => {
          setIsLoaded(true);
          sessionStorage.setItem("hcu_preloaded", "true");
        }, 300);
      }
    }, 150);

    return () => clearInterval(interval);
  }, [shouldShow]);

  if (!shouldShow) return null;

  return (
    <AnimatePresence>
      {!isLoaded && (
        <motion.div
          key="preloader"
          initial={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.5, ease: "easeInOut" }}
          className="fixed inset-0 z-[100] flex flex-col items-center justify-center bg-gradient-to-r from-white to-gray-200 animate-gradient-xy"
        >
          <div className="mb-6 text-center">
            <Image
              src="/atom/atom.png"
              alt="HCU Logo"
              width={400}
              height={400}
              priority
            />
            <div className="-mt-10 text-xl font-bold text-black text-center">
              Huachiew Chalermprakiat University
              <br />
              Computational Science and Digital Technology
            </div>
          </div>
          
          <div className="w-64 bg-gray-200 rounded-full h-2.5">
            <motion.div
              className="bg-slate-900 h-2.5 rounded-full"
              initial={{ width: 0 }}
              animate={{ width: `${loadingProgress}%` }}
              transition={{ duration: 0.2, ease: "linear" }}
            />
          </div>

          <div className="mt-4 text-lg font-semibold text-black">
            {Math.round(loadingProgress)}%
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
