"use client"

import { useSession } from "@/context/SessionContext"
import { Package, User } from "lucide-react"

function StatsCard({ icon: Icon, label, loading = false }) {
  return (
    <div className="overflow-hidden rounded-lg border border-border bg-card">
      <div className="p-6">
        <div className="flex items-start justify-between">
          <div className="space-y-2 flex-1">
            <p className="text-sm font-medium text-muted-foreground">{label}</p>
            {loading ? (
              <div className="h-8 w-24 animate-pulse rounded bg-muted" />
            ) : (
              <p className="text-3xl font-bold">—</p>
            )}
          </div>
          <div className="rounded-lg bg-muted p-2.5">
            <Icon className="h-5 w-5 text-muted-foreground" />
          </div>
        </div>
      </div>
    </div>
  )
}

export default function HomeStats() {
  const { sessionLoading: loading } = useSession()

  return (
    <section className="border-b border-border bg-muted/30">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex justify-center">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 w-full max-w-2xl">
            <StatsCard icon={Package} label="Total de peças" loading={loading} />
            <StatsCard icon={User} label="Usuarios ativos" loading={loading} />
          </div>
        </div>
      </div>
    </section>
  )
}
