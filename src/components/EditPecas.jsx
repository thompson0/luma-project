"use client"

import { useState } from "react"
import { Button } from "../ui/button"
import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogClose,
} from "../ui/dialog"
import { Input } from "../ui/input"
import { Pencil } from "lucide-react"
import { useSecureFetch } from "@/hooks/useSecureFetch"
import { useRefresh } from "@/context/RefreshContext"
import MultiImageUpload from "../ui/MultiImageUpload"

export default function EditPecas({ id, onUpdated }) {
  const [form, setForm] = useState({
    name: "",
    materials: "",
    preco: "",
    fotos: [],
  })
  const [open, setOpen] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const { secureFetch, loading } = useSecureFetch()
  const { triggerRefresh } = useRefresh()

  async function handleOpenDialog() {
    setIsLoading(true)
    try {
      const res = await fetch(`/api/v1/pecas/${id}`)
      if (res.ok) {
        const data = await res.json()
        setForm({
          name: data.name || "",
          materials: data.materials || "",
          preco: data.preco || "",
          fotos: data.fotos || [],
        })
      }
    } catch (err) {
      console.error("Erro ao buscar peça:", err)
    } finally {
      setIsLoading(false)
    }
  }

  async function handleEditPecas(e) {
    e.preventDefault()

    const fotosValidas = form.fotos.filter(url => url && url.trim() !== "")

    try {
      const res = await secureFetch(
        `/api/v1/pecas/${id}`,
        {
          method: "PUT",
          body: JSON.stringify({
            name: form.name,
            materials: form.materials,
            preco: form.preco ? Number(form.preco) : 0,
            fotos: fotosValidas,
          }),
        },
        {
          successMsg: "Peça atualizada com sucesso!",
          errorMsg: "Não foi possível atualizar a peça.",
        }
      )

      if (!res) return

      const pecaAtualizada = await res.json()

      if (onUpdated) onUpdated(pecaAtualizada)

      triggerRefresh()

      setForm({
        name: "",
        materials: "",
        preco: "",
        fotos: [],
      })
      setOpen(false)
    } catch (err) {
      console.error("Erro ao atualizar peça:", err)
    }
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button
          size="icon"
          variant="ghost"
          onClick={handleOpenDialog}
          title="Editar peça"
        >
          <Pencil className="h-4 w-4" />
        </Button>
      </DialogTrigger>

      <DialogContent className="max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Editar peça</DialogTitle>
        </DialogHeader>

        <form onSubmit={handleEditPecas} className="space-y-3">
          <Input
            placeholder="Nome da peça"
            value={form.name}
            onChange={(e) => setForm({ ...form, name: e.target.value })}
            required
          />

          <Input
            placeholder="Material"
            value={form.materials}
            onChange={(e) => setForm({ ...form, materials: e.target.value })}
          />

          <Input
            placeholder="Preço (ex: 199.90)"
            type="number"
            step="0.01"
            value={form.preco}
            onChange={(e) => setForm({ ...form, preco: e.target.value })}
          />

          <MultiImageUpload
            label="Fotos da peça"
            value={form.fotos}
            onChange={(fotos) => setForm({ ...form, fotos })}
          />

          <DialogFooter>
            <DialogClose asChild>
              <Button type="button" variant="outline">
                Cancelar
              </Button>
            </DialogClose>
            <Button type="submit" disabled={loading || isLoading}>
              {loading ? "Salvando..." : "Atualizar"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
