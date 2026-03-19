"use client"

import { useState } from "react"
import { Button } from "../components/ui/button"
import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogClose,
} from "../components/ui/dialog"
import { Input } from "../components/ui/input"
import { PlusSquare } from "lucide-react"
import { useSecureFetch } from "@/hooks/useSecureFetch"
import { useRefresh } from "@/context/RefreshContext"
import MultiImageUpload from "./MultiImageUpload"
export default function AddPecas({ onCreated, trigger, canOpen = true, onDeniedOpen }) {
  const [form, setForm] = useState({
    name: "",
    materials: "",
    preco: "",
    fotos: [],
  })
  const [open, setOpen] = useState(false)
  const { secureFetch, loading } = useSecureFetch()
  const { triggerRefresh } = useRefresh()



  async function handleAddPecas(e) {
    e.preventDefault()

    const fotosValidas = form.fotos.filter(url => url && url.trim() !== "")

    try {
      const res = await secureFetch(
        "/api/v1/pecas",
        {
          method: "POST",
          body: JSON.stringify({
            name: form.name,
            materials: form.materials,
            preco: form.preco ? Number(form.preco) : 0,
            fotos: fotosValidas,
          }),
        },
        {
          successMsg: "Peça criada com sucesso!",
          errorMsg: "Não foi possível criar a peça.",
        }
      )

      if (!res) return

      const novaPeca = await res.json()

      if (onCreated) onCreated(novaPeca)

      triggerRefresh()

      setForm({
        name: "",
        materials: "",
        preco: "",
        fotos: [],
      })
      setOpen(false)
    } catch (err) {
      console.error("Erro ao adicionar peça:", err)
    }
  }

  return (
    <Dialog
      open={open}
      onOpenChange={(nextOpen) => {
        if (nextOpen && !canOpen) {
          if (onDeniedOpen) onDeniedOpen()
          return
        }
        setOpen(nextOpen)
      }}
    >
      <DialogTrigger asChild>
        {trigger || (
          <Button size="icon">
            <PlusSquare />
          </Button>
        )}
      </DialogTrigger>

      <DialogContent className="max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Cadastrar nova peça</DialogTitle>
        </DialogHeader>

        <form onSubmit={handleAddPecas} className="space-y-3">

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
            value={form.fotos}
            onChange={(newFotos) => setForm({ ...form, fotos: newFotos })}
          />


          <DialogFooter>
            <DialogClose asChild>
              <Button type="button" variant="outline">
                Cancelar
              </Button>
            </DialogClose>
            <Button type="submit" disabled={loading}>
              {loading ? "Salvando..." : "Salvar"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}