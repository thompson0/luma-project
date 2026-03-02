"use client";

import Image from "next/image";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { DarkMode } from "@/components/DarkMode";
import { PlayCircleIcon, Bars3Icon, XMarkIcon, ChatBubbleLeftRightIcon } from "@heroicons/react/24/outline";
import { Facebook, Instagram, LogOut } from "lucide-react";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useSession } from "@/context/SessionContext";
import { useRefresh } from "@/context/RefreshContext";

function NavHome() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const { isLoggedIn } = useSession();
  const { triggerRefresh } = useRefresh();
  const router = useRouter();

  async function handleLogout() {
    try {
      await fetch("/api/v1/auth/sign-out", {
        method: "POST",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({}),
      });
    } catch (err) {
      console.error("Erro ao fazer logout:", err);
    }
    triggerRefresh();
    router.push("/");
    router.refresh();
  }

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);



  return (
    <nav
      className={`fixed top-0 left-0 w-full z-50 flex-shrink-0 transition-colors duration-300 ${isScrolled
          ? "bg-background/95 backdrop-blur-md shadow-lg border-b border-border"
          : "bg-transparent border-b border-transparent"
        }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16 md:h-20">
          <Link href="/" className="flex items-center gap-3">
            <Image
              src="/logo.png"
              alt="Luma SemiJoias"
              width={160}
              height={80}
              className="h-14 w-auto object-contain"
              priority
            />
            <div className="hidden sm:block">
              <span className={`font-bold text-lg md:text-xl tracking-tight transition-colors ${isScrolled ? "text-foreground" : "text-white"
                }`}>
              
              </span>
              <p className={`text-xs transition-colors ${isScrolled ? "text-muted-foreground" : "text-white/70"
                }`}>
            
              </p>
            </div>
          </Link>

          <div className="hidden md:flex items-center gap-2">
            <DarkMode />

            <Link href="https://www.instagram.com/luma_semijoiasartesanais/"  aria-label="Instagram">
              <Button
                variant="ghost"
                size="icon"
                className={`transition-colors ${isScrolled
                  ? "text-foreground hover:bg-accent hover:text-foreground"
                  : "text-foreground dark:text-white hover:bg-accent/40 dark:hover:bg-white/10"
                }`}
              >
                <Instagram className="w-5 h-5" />
              </Button>
            </Link>

            <Link href="/visitante/videos">
              <Button
                variant="ghost"
                className={`flex gap-2 items-center transition-colors ${isScrolled
                    ? "text-foreground hover:bg-accent hover:text-foreground"
                    : "text-foreground dark:text-white hover:bg-accent/40 dark:hover:bg-white/10"
                  }`}
              >
                <PlayCircleIcon className="w-5 h-5" />
                Vídeos
              </Button>
            </Link>

            {isLoggedIn ? (
              <Button
                onClick={handleLogout}
                variant="ghost"
                className={`flex gap-2 items-center transition-colors ${isScrolled
                  ? "text-foreground hover:bg-accent hover:text-foreground"
                  : "text-foreground dark:text-white hover:bg-accent/40 dark:hover:bg-white/10"
                }`}
              >
                <LogOut className="w-5 h-5" />
                Sair
              </Button>
            ) : (
              <Link href="/login">
                <Button
                  className="bg-primary hover:bg-primary/90 text-primary-foreground px-6"
                >
                  Entrar
                </Button>
              </Link>
            )}
          </div>

          <button
            className="md:hidden p-2"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          >
            {isMobileMenuOpen ? (
              <XMarkIcon className={`w-6 h-6 ${isScrolled ? "text-foreground" : "text-white"}`} />
            ) : (
              <Bars3Icon className={`w-6 h-6 ${isScrolled ? "text-foreground" : "text-white"}`} />
            )}
          </button>
        </div>

        {isMobileMenuOpen && (
          <div className="md:hidden bg-background/95 backdrop-blur-md border-t border-border py-4 px-2 space-y-2">
            <div className="flex items-center gap-2">
              <Link href="https://www.instagram.com/luma_semijoiasartesanais/" aria-label="Instagram">
                <Button variant="ghost" className="w-full justify-start gap-2 text-foreground">
                  <Instagram className="w-5 h-5" />
                  Instagram
                </Button>
              </Link>
            </div>
            <Link href="/login" onClick={() => setIsMobileMenuOpen(false)}>
              <Button variant="ghost" className="w-full justify-start gap-2 text-foreground">
                <PlayCircleIcon className="w-5 h-5" />
                Vídeos
              </Button>
            </Link>
            {isLoggedIn ? (
              <Button
                variant="ghost"
                className="w-full justify-start gap-2 text-foreground"
                onClick={() => { setIsMobileMenuOpen(false); handleLogout(); }}
              >
                <LogOut className="w-5 h-5" />
                Sair
              </Button>
            ) : (
              <Link href="/login" onClick={() => setIsMobileMenuOpen(false)}>
                <Button variant="ghost" className="w-full justify-start gap-2 text-foreground">
                  Entrar
                </Button>
              </Link>
            )}
            <div className="pt-2 border-t border-border">
              <DarkMode />
            </div>
          </div>
        )}
      </div>
    </nav>
  );
}

export default NavHome;