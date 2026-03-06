"use client"

import { useEffect, useState } from "react"
import { Button } from "@/components/ui/button"
import {
  Package,
  TrendingUp,
  User,
  AlertCircle,
  CheckCircle2,
  Loader2,
} from "lucide-react"

function AlertItem({ title, description, variant = "default" }) {
  const isWarning = variant === "warning"
  const isSuccess = variant === "success"

  return (
    <div
      className={`rounded-lg border p-4 ${
        isWarning
          ? "border-yellow-200 bg-yellow-50 dark:border-yellow-900/30 dark:bg-yellow-900/10"
          : isSuccess
            ? "border-emerald-200 bg-emerald-50 dark:border-emerald-900/30 dark:bg-emerald-900/10"
            : "border-blue-200 bg-blue-50 dark:border-blue-900/30 dark:bg-blue-900/10"
      }`}
    >
      <div className="flex gap-3">
        <div className="shrink-0 mt-0.5">
          {isSuccess ? (
            <CheckCircle2
              className={`h-5 w-5 ${
                isSuccess
                  ? "text-emerald-600 dark:text-emerald-400"
                  : "text-blue-600 dark:text-blue-400"
              }`}
            />
          ) : (
            <AlertCircle
              className={`h-5 w-5 ${
                isWarning
                  ? "text-yellow-600 dark:text-yellow-400"
                  : "text-blue-600 dark:text-blue-400"
              }`}
            />
          )}
        </div>
        <div className="flex-1">
          <p
            className={`text-sm font-semibold ${
              isWarning
                ? "text-yellow-900 dark:text-yellow-200"
                : isSuccess
                  ? "text-emerald-900 dark:text-emerald-200"
                  : "text-blue-900 dark:text-blue-200"
            }`}
          >
            {title}
          </p>
          <p
            className={`mt-1 text-xs ${
              isWarning
                ? "text-yellow-700 dark:text-yellow-300"
                : isSuccess
                  ? "text-emerald-700 dark:text-emerald-300"
                  : "text-blue-700 dark:text-blue-300"
            }`}
          >
            {description}
          </p>
        </div>
      </div>
    </div>
  )
}

function formatUptime(seconds) {
  const h = Math.floor(seconds / 3600)
  const m = Math.floor((seconds % 3600) / 60)
  if (h > 0) return `${h}h ${m}min`
  return `${m}min`
}

function formatDate(dateStr) {
  if (!dateStr) return null
  const date = new Date(dateStr)
  return date.toLocaleString("pt-BR", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  })
}

export default function AlertsAndActions() {
  const [health, setHealth] = useState(null)
  const [backup, setBackup] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function fetchData() {
      try {
        const [healthRes, backupRes] = await Promise.all([
          fetch("/api/v1/health"),
          fetch("/api/v1/backup"),
        ])

        const healthData = await healthRes.json()
        const backupData = await backupRes.json()

        setHealth({ ...healthData, ok: healthRes.ok })
        setBackup({ ...backupData, ok: backupRes.ok })
      } catch {
        setHealth({ ok: false })
        setBackup({ ok: false })
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [])

  const alerts = []

  if (loading) {
    alerts.push({
      title: "Carregando status...",
      description: "Verificando saúde do sistema e backup.",
      variant: "default",
    })
  } else {
    // Health / API
    if (health?.ok && health?.db === "connected") {
      alerts.push({
        title: "API conectada",
        description: `Banco de dados operacional. Uptime: ${formatUptime(health.uptime)}.`,
        variant: "success",
      })
    } else {
      alerts.push({
        title: "API com problema",
        description: health?.error || "Não foi possível conectar ao banco de dados.",
        variant: "warning",
      })
    }

    // Backup
    if (backup?.ok && backup?.lastBackup) {
      alerts.push({
        title: "Backup realizado",
        description: `Último backup: ${formatDate(backup.lastBackup)} — Status: ${backup.status}, Tipo: ${backup.type}.`,
        variant: "success",
      })
    } else if (backup?.ok && !backup?.lastBackup) {
      alerts.push({
        title: "Nenhum backup encontrado",
        description: "Nenhum snapshot de backup disponível. Verifique se o plano do cluster suporta backups.",
        variant: "warning",
      })
    } else {
      alerts.push({
        title: "Erro ao verificar backup",
        description: backup?.error || "Não foi possível consultar o status do backup.",
        variant: "warning",
      })
    }
  }

  return (
    <section className="border-b border-border">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2">
            <h2 className="mb-6 text-2xl font-bold tracking-tight">Avisos</h2>
            <div className="space-y-4">
              {loading ? (
                <div className="flex items-center gap-2 text-muted-foreground text-sm">
                  <Loader2 className="h-4 w-4 animate-spin" />
                  Verificando status do sistema...
                </div>
              ) : (
                alerts.map((alert, i) => (
                  <AlertItem key={i} {...alert} />
                ))
              )}
            </div>
          </div>

          <div>
            <h2 className="mb-6 text-2xl font-bold tracking-tight">Ações</h2>
            <div className="space-y-3">
              <Button className="w-full justify-start" variant="outline" size="sm">
                <Package className="mr-2 h-4 w-4" />
                Adicionar peça
              </Button>
              <Button className="w-full justify-start" variant="outline" size="sm">
                <TrendingUp className="mr-2 h-4 w-4" />
                Gerar relatório
              </Button>
              <Button className="w-full justify-start" variant="outline" size="sm">
                <User className="mr-2 h-4 w-4" />
                Novo Usuario
              </Button>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
