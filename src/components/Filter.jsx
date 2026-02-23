"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Search, X } from "lucide-react"

export default function Filter({ onFilter }) {
  const [isOpen, setIsOpen] = useState(false)

  const [filters, setFilters] = useState({
    nome: "",
    minPreco: "",
    maxPreco: "",
    dataInicio: "",
    dataFim: "",
  })

  function handleChange(e) {
    const { name, value } = e.target
    setFilters(prev => ({ ...prev, [name]: value }))
  }

  function handleApplyFilter() {
    const query = new URLSearchParams()

    if (filters.nome) query.append("nome", filters.nome)
    if (filters.minPreco) query.append("minPreco", filters.minPreco)
    if (filters.maxPreco) query.append("maxPreco", filters.maxPreco)
    if (filters.dataInicio) query.append("dataInicio", filters.dataInicio)
    if (filters.dataFim) query.append("dataFim", filters.dataFim)

    onFilter(query.toString()) // 🔥 sempre permite aplicar
    setIsOpen(false)
  }

  function handleClearFilter() {
    setFilters({
      nome: "",
      minPreco: "",
      maxPreco: "",
      dataInicio: "",
      dataFim: "",
    })

    onFilter("") 
  }

  return (
    <div className="relative flex gap-2">
      <Button
        variant="outline"
        size="sm"
        onClick={() => setIsOpen(!isOpen)}
        className="gap-2"
      >
        <Search className="h-4 w-4" />
        Filtros
      </Button>

      <Button
        variant="ghost"
        size="sm"
        onClick={handleClearFilter}
        className="gap-2 text-destructive"
      >
        <X className="h-4 w-4" />
        Limpar filtros
      </Button>

      {isOpen && (
        <div className="absolute top-full left-0 mt-2 bg-card border border-border rounded-lg shadow-lg p-4 z-50 w-80">
          <div className="space-y-4">

            <div className="space-y-1">
              <label className="text-sm font-medium">Preço</label>
              <div className="flex gap-2">
                <Input
                  name="minPreco"
                  placeholder="Min"
                  type="number"
                  step="0.01"
                  value={filters.minPreco}
                  onChange={handleChange}
                />
                <Input
                  name="maxPreco"
                  placeholder="Max"
                  type="number"
                  step="0.01"
                  value={filters.maxPreco}
                  onChange={handleChange}
                />
              </div>
            </div>

            <div className="space-y-1">
              <label className="text-sm font-medium">Data de Criação</label>
              <div className="flex gap-2">
                <Input
                  name="dataInicio"
                  type="date"
                  value={filters.dataInicio}
                  onChange={handleChange}
                />
                <Input
                  name="dataFim"
                  type="date"
                  value={filters.dataFim}
                  onChange={handleChange}
                />
              </div>
            </div>

            <div className="flex gap-2 pt-2">
              <Button
                size="sm"
                variant="outline"
                onClick={() => setIsOpen(false)}
              >
                Fechar
              </Button>
              <Button
                size="sm"
                onClick={handleApplyFilter}
              >
                Aplicar Filtros
              </Button>
            </div>

          </div>
        </div>
      )}
    </div>
  )
}