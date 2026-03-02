"use client"

import { Button } from "@/components/ui/button"
import { useSession } from "@/context/SessionContext"
import { Zap, LayoutDashboard } from "lucide-react"

export default function HomeGreeting() {
  const { user } = useSession()

  const greeting = () => {
    const hour = new Date().getHours()
    if (hour < 12) return "Bom dia"
    if (hour < 18) return "Boa tarde"
    return "Boa noite"
  }

  return (
    <section className="border-b border-border bg-card">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div className="space-y-2">
            <p className="text-sm font-medium text-muted-foreground">
              {greeting()}, {user?.name || user?.email?.split("@")[0] || "Usuário"}
            </p>
            <h1 className="text-3xl sm:text-4xl font-bold tracking-tight">
              Luma Bijoux
            </h1>
            <p className="text-sm text-muted-foreground max-w-lg">
              Seu painel de controle para estoque, vendas e operações.
            </p>
          </div>
          <div className="flex shrink-0 gap-2">
            <Button variant="ghost" size="icon" title="Notificações">
              <Zap className="h-5 w-5" />
            </Button>
            <Button variant="ghost" size="icon" title="Menu">
              <LayoutDashboard className="h-5 w-5" />
            </Button>
          </div>
        </div>
      </div>
    </section>
  )
}
