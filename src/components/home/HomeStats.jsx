"use client"

import { useEffect, useState } from "react"
import { useSession } from "@/context/SessionContext"
import { Package, User } from "lucide-react"

function StatsCard({ icon: Icon, label, value, loading = false }) {
  return (
    <div className="overflow-hidden rounded-lg border border-border bg-card">
      <div className="p-6">
        <div className="flex items-start justify-between">
          <div className="space-y-2 flex-1">
            <p className="text-sm font-medium text-muted-foreground">{label}</p>
            {loading ? (
              <div className="h-8 w-24 animate-pulse rounded bg-muted" />
            ) : (
              <p className="text-3xl font-bold">{value ?? "—"}</p>
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
  const { sessionLoading } = useSession()
  const [totalPecas, setTotalPecas] = useState(null)
  const [totalUsers, setTotalUsers] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function fetchTotals() {
      try {
        const [pecasRes, usersRes] = await Promise.all([
          fetch("/api/v1/total/pecas"),
          fetch("/api/v1/total/users"),
        ])

        if (pecasRes.ok) {
          const pecasData = await pecasRes.json()
          setTotalPecas(pecasData.total)
        }

        if (usersRes.ok) {
          const usersData = await usersRes.json()
          setTotalUsers(usersData.total)
        }
      } catch {
        // mantém null se falhar
      } finally {
        setLoading(false)
      }
    }

    fetchTotals()
  }, [])

  const isLoading = sessionLoading || loading

  return (
    <section className="border-b border-border bg-muted/30">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex justify-center">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 w-full max-w-2xl">
            <StatsCard icon={Package} label="Total de peças" value={totalPecas} loading={isLoading} />
            <StatsCard icon={User} label="Usuarios ativos" value={totalUsers} loading={isLoading} />
          </div>
        </div>
      </div>
    </section>
  )
}
