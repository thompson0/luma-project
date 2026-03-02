"use client"

import { Button } from "@/components/ui/button"
import {
  Package,
  TrendingUp,
  User,
  AlertCircle,
  CheckCircle2,
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

export default function AlertsAndActions() {
  return (
    <section className="border-b border-border">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2">
            <h2 className="mb-6 text-2xl font-bold tracking-tight">Avisos</h2>
            <div className="space-y-4">
              <AlertItem
                title="Reposição em andamento"
                description="Últimos itens da coleção primavera serão enviados hoje."
                variant="warning"
              />
              <AlertItem
                title="Backup realizado"
                description="Backup automático concluído com sucesso às 3:15 AM."
                variant="success"
              />
              <AlertItem
                title="API conectada"
                description="Integração com sistema de carrinhos está operacional."
                variant="success"
              />
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
