"use client";

import { useEffect, useState, useCallback, Suspense } from "react";
import { usePathname, useSearchParams } from "next/navigation";
import { Progress } from "@/components/ui/progress";

function NavigationEvents({ onComplete }) {
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
    const handleClick = (e) => {
      const target = e.target.closest("a");
      if (target && target.href && !target.href.startsWith("#") && !target.target) {
        const url = new URL(target.href, window.location.origin);
        if (url.origin === window.location.origin && url.pathname !== window.location.pathname) {
          setIsLoading(true);
          setProgress(0);
        }
      }
    };

    document.addEventListener("click", handleClick);
    return () => document.removeEventListener("click", handleClick);
  }, []);

  useEffect(() => {
    if (!isLoading) return;

    // Rápido no início, desacelera perto do fim
    let frame;
    const animate = () => {
      setProgress((prev) => {
        if (prev >= 90) return prev;
        const increment = prev < 30 ? 8 : prev < 60 ? 4 : 1.5;
        return Math.min(prev + increment, 90);
      });
      frame = requestAnimationFrame(animate);
    };

    // Pequeno delay para garantir que a barra aparece em 0 antes de animar
    const timeout = setTimeout(() => {
      frame = requestAnimationFrame(animate);
    }, 50);

    return () => {
      clearTimeout(timeout);
      cancelAnimationFrame(frame);
    };
  }, [isLoading]);

  const handleComplete = useCallback(() => {
    setProgress(100);
    const timeout = setTimeout(() => {
      setIsLoading(false);
      setProgress(0);
    }, 300);
    return () => clearTimeout(timeout);
  }, []);

  if (!isLoading) return (
    <Suspense fallback={null}>
      <NavigationEvents onComplete={handleComplete} />
    </Suspense>
  );

  return (
    <>
      <Suspense fallback={null}>
        <NavigationEvents onComplete={handleComplete} />
      </Suspense>

      <div className="fixed top-0 left-0 right-0 z-[9999]">
        <Progress
          value={progress}
          className="h-[3px] rounded-none bg-transparent [&>div]:transition-all [&>div]:duration-300 [&>div]:ease-out"
        />
      </div>
    </>
  );
}