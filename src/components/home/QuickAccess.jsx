"use client"

import Link from "next/link"
import { Package, User, ArrowRight } from "lucide-react"

const navigationItems = [
  {
    title: "Estoque e peças",
    description: "Gerencie cadastros, lotes e reposições de produtos.",
    href: "/catalogo",
    icon: Package,
    color: "from-blue-500 to-cyan-500",
  },
  {
    title: "Usuarios",
    description: "Gerenciar contatos, histórico e preferências.",
    href: "/users",
    icon: User,
    color: "from-pink-500 to-rose-500",
  },
]

export default function QuickAccess() {
  return (
    <section className="border-b border-border">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
        <div className="mb-8">
          <h2 className="text-2xl font-bold tracking-tight">Acesso rápido</h2>
          <p className="mt-1 text-sm text-muted-foreground">
            Navegue para as principais funcionalidades do sistema
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {navigationItems.map((item) => {
            const Icon = item.icon
            return (
              <Link key={item.title} href={item.href}>
                <div className="group relative overflow-hidden rounded-lg border border-border bg-card p-6 transition-all hover:border-primary/50 hover:shadow-md hover:-translate-y-1">
                  <div
                    className={`absolute inset-0 opacity-0 bg-gradient-to-br ${item.color} transition-opacity group-hover:opacity-10`}
                  />
                  <div className="relative z-10">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center gap-2">
                          <Icon className="h-5 w-5 text-foreground" />
                          <h3 className="text-lg font-semibold">{item.title}</h3>
                        </div>
                        <p className="mt-2 text-sm text-muted-foreground">
                          {item.description}
                        </p>
                      </div>
                      <ArrowRight className="h-5 w-5 text-muted-foreground transition-transform group-hover:translate-x-1" />
                    </div>
                  </div>
                </div>
              </Link>
            )
          })}
        </div>
      </div>
    </section>
  )
}
