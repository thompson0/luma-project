"use client"

import { useState } from "react"
import { Button } from "./ui/button"
import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogClose,
} from "./ui/dialog"
import { Trash2 } from "lucide-react"
import { useSecureFetch } from "@/hooks/useSecureFetch"
import { useRefresh } from "@/context/RefreshContext"

export default function DeletePecas({ id, nome, onDeleted }) {
  const [open, setOpen] = useState(false)
  const { secureFetch, loading } = useSecureFetch()
  const { triggerRefresh } = useRefresh()

  async function handleDeletePecas() {
    try {
      const res = await secureFetch(
        `/api/v1/pecas/${id}`,
        {
          method: "DELETE",
        },
        {
          successMsg: "Peça deletada com sucesso!",
          errorMsg: "Não foi possível deletar a peça.",
        }
      )

      if (!res) return

      if (onDeleted) onDeleted(id)

      triggerRefresh()

      setOpen(false)
    } catch (err) {
      console.error("Erro ao deletar peça:", err)
    }
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button
          size="icon"
          variant="ghost"
          className="text-destructive hover:text-destructive"
          title="Deletar peça"
        >
          <Trash2 className="h-4 w-4" />
        </Button>
      </DialogTrigger>

      <DialogContent>
        <DialogHeader>
          <DialogTitle>Deletar peça</DialogTitle>
        </DialogHeader>

        <p className="text-sm text-muted-foreground">
          Tem certeza que deseja deletar a peça <strong>{nome}</strong>? Esta ação não pode ser desfeita.
        </p>

        <DialogFooter>
          <DialogClose asChild>
            <Button type="button" variant="outline">
              Cancelar
            </Button>
          </DialogClose>
          <Button
            type="button"
            variant="destructive"
            onClick={handleDeletePecas}
            disabled={loading}
          >
            {loading ? "Deletando..." : "Deletar"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
