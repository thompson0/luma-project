"use client";

import { useEffect, useState, Suspense } from "react";
import { usePathname, useSearchParams } from "next/navigation";

function NavigationEvents({ onStart, onComplete }) {
  const pathname = usePathname();
  const searchParams = useSearchParams();

  useEffect(() => {
    onComplete();
  }, [pathname, searchParams, onComplete]);

  return null;
}

export function NavigationLoader() {
  const [isLoading, setIsLoading] = useState(false);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const handleStart = () => {
      setIsLoading(true);
      setProgress(0);
    };

    const handleClick = (e) => {
      const target = e.target.closest("a");
      if (target && target.href && !target.href.startsWith("#") && !target.target) {
        const url = new URL(target.href, window.location.origin);
        if (url.origin === window.location.origin && url.pathname !== window.location.pathname) {
          handleStart();
        }
      }
    };

    document.addEventListener("click", handleClick);
    return () => document.removeEventListener("click", handleClick);
  }, []);

  useEffect(() => {
    if (isLoading) {
      const interval = setInterval(() => {
        setProgress((prev) => {
          if (prev >= 85) {
            clearInterval(interval);
            return prev;
          }
          return prev + Math.random() * 15;
        });
      }, 150);
      return () => clearInterval(interval);
    }
  }, [isLoading]);

  const handleComplete = () => {
    setProgress(100);
    setTimeout(() => {
      setIsLoading(false);
      setProgress(0);
    }, 200);
  };

  return (
    <>
      <Suspense fallback={null}>
        <NavigationEvents onStart={() => setIsLoading(true)} onComplete={handleComplete} />
      </Suspense>

      <div
        className={`fixed top-0 left-0 right-0 h-1 z-[9999] transition-opacity duration-200 ${
          isLoading ? "opacity-100" : "opacity-0"
        }`}
      >
        <div
          className="h-full bg-gradient-to-r from-blue-500 via-indigo-500 to-purple-500 shadow-lg shadow-blue-500/50 transition-all duration-150 ease-out"
          style={{ width: `${progress}%` }}
        />
        <div 
          className="absolute right-0 top-0 h-full w-24 bg-gradient-to-l from-white/30 to-transparent animate-pulse"
          style={{ transform: `translateX(${progress < 100 ? '0' : '100%'})` }}
        />
      </div>

      {isLoading && (
        <div className="fixed inset-0 z-[9998] pointer-events-none flex items-center justify-center">
          <div className="bg-background/90 backdrop-blur-md rounded-2xl p-6 shadow-2xl border border-border/50 flex flex-col items-center gap-4 pointer-events-auto">
            <div className="relative">
              <div className="w-12 h-12 rounded-full border-4 border-blue-500/20"></div>
              <div className="absolute inset-0 w-12 h-12 rounded-full border-4 border-transparent border-t-blue-500 border-r-blue-500 animate-spin"></div>
            </div>
            <p className="text-sm font-medium text-foreground">Carregando...</p>
          </div>
        </div>
      )}
    </>
  );
}