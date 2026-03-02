"use client"

import { useState, useEffect, useCallback } from "react"
import { useRouter } from "next/navigation"
import NavHome from "@/components/NavHome"
import { useSecureFetch } from "@/hooks/useSecureFetch"
import { useSession } from "@/context/SessionContext"
import { useAlert } from "@/context/AlertContext"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
  DialogClose,
} from "@/components/ui/dialog"
import {
  MagnifyingGlassIcon,
  TrashIcon,
  PencilSquareIcon,
  UserPlusIcon,
} from "@heroicons/react/24/outline"
import { ShieldCheck, User as UserIcon, Mail, Loader2 } from "lucide-react"

function UsersPage() {
  const [users, setUsers] = useState([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState("")
  const [deleteTarget, setDeleteTarget] = useState(null)
  const [editTarget, setEditTarget] = useState(null)
  const [editForm, setEditForm] = useState({ name: "", email: "", role: "" })
  const [addOpen, setAddOpen] = useState(false)
  const [addForm, setAddForm] = useState({ name: "", email: "", senha: "", role: "user" })
  const [actionLoading, setActionLoading] = useState(false)

  const { secureFetch } = useSecureFetch()
  const { user: sessionUser, isAdmin, sessionLoading } = useSession()
  const { triggerAlert } = useAlert()
  const router = useRouter()

  const loadUsers = useCallback(async () => {
    try {
      const res = await fetch("/api/v1/users", { credentials: "include" })
      if (res.ok) {
        const data = await res.json()
        setUsers(data)
      }
    } catch (err) {
      console.error("Erro ao buscar usuários:", err)
    }
  }, [])

  useEffect(() => {
    if (sessionLoading) return

    if (!isAdmin) {
      triggerAlert("error", "Acesso negado!", "Você precisa ser administrador para acessar esta página.")
      router.replace("/")
      return
    }

    loadUsers().then(() => setLoading(false))
  }, [sessionLoading, isAdmin])

  const filteredUsers = users.filter((u) => {
    const term = search.toLowerCase()
    return (
      u.name?.toLowerCase().includes(term) ||
      u.email?.toLowerCase().includes(term) ||
      u.role?.toLowerCase().includes(term)
    )
  })

  async function handleDelete() {
    if (!deleteTarget) return
    setActionLoading(true)
    try {
      const res = await secureFetch(`/api/v1/users/${deleteTarget._id}`, {
        method: "DELETE",
      })
      if (res) {
        triggerAlert("success", "Sucesso!", "Usuário removido com sucesso.")
        await loadUsers()
      }
    } finally {
      setActionLoading(false)
      setDeleteTarget(null)
    }
  }

  function openEdit(user) {
    setEditTarget(user)
    setEditForm({ name: user.name, email: user.email, role: user.role })
  }

  async function handleEdit() {
    if (!editTarget) return
    setActionLoading(true)
    try {
      const res = await secureFetch(`/api/v1/users/${editTarget._id}`, {
        method: "PUT",
        body: JSON.stringify(editForm),
      })
      if (res) {
        triggerAlert("success", "Sucesso!", "Usuário atualizado com sucesso.")
        await loadUsers()
      }
    } finally {
      setActionLoading(false)
      setEditTarget(null)
    }
  }

  async function handleAdd() {
    setActionLoading(true)
    try {
      const res = await secureFetch("/api/v1/users", {
        method: "POST",
        body: JSON.stringify(addForm),
      })
      if (res) {
        triggerAlert("success", "Sucesso!", "Usuário criado com sucesso.")
        setAddForm({ name: "", email: "", senha: "", role: "user" })
        setAddOpen(false)
        await loadUsers()
      }
    } finally {
      setActionLoading(false)
    }
  }

  const roleBadge = (role) => {
    if (role === "admin") {
      return (
        <span className="inline-flex items-center gap-1 rounded-full bg-primary/10 px-2.5 py-0.5 text-xs font-medium text-primary">
          <ShieldCheck className="size-3" />
          Admin
        </span>
      )
    }
    return (
      <span className="inline-flex items-center gap-1 rounded-full bg-secondary px-2.5 py-0.5 text-xs font-medium text-secondary-foreground">
        <UserIcon className="size-3" />
        Usuário
      </span>
    )
  }

  if (loading) {
    return (
      <div className="min-h-screen flex flex-col bg-background">
        <NavHome />
        <main className="flex-1 flex items-center justify-center">
          <Loader2 className="size-8 animate-spin text-muted-foreground" />
        </main>
      </div>
    )
  }

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <NavHome />

      <main className="flex-1 w-full max-w-7xl mx-auto px-6 py-12 pt-28">
        {/* Header */}
        <div className="mb-10 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold">Usuários</h1>
            <p className="text-muted-foreground mt-1">
              Gerencie os usuários cadastrados no sistema
            </p>
          </div>
          {isAdmin && (
            <Button onClick={() => setAddOpen(true)} className="gap-2">
              <UserPlusIcon className="size-4" />
              Novo Usuário
            </Button>
          )}
        </div>

        {/* Search */}
        <div className="relative mb-8 max-w-md">
          <MagnifyingGlassIcon className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
          <Input
            placeholder="Buscar por nome, email ou cargo..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-9"
          />
        </div>

        {/* Stats */}
        <div className="flex gap-4 mb-8">
          <div className="rounded-lg border bg-card px-4 py-3">
            <p className="text-sm text-muted-foreground">Total</p>
            <p className="text-2xl font-bold">{users.length}</p>
          </div>
          <div className="rounded-lg border bg-card px-4 py-3">
            <p className="text-sm text-muted-foreground">Admins</p>
            <p className="text-2xl font-bold">
              {users.filter((u) => u.role === "admin").length}
            </p>
          </div>
          <div className="rounded-lg border bg-card px-4 py-3">
            <p className="text-sm text-muted-foreground">Usuários</p>
            <p className="text-2xl font-bold">
              {users.filter((u) => u.role !== "admin").length}
            </p>
          </div>
        </div>

        {/* Table */}
        {filteredUsers.length === 0 ? (
          <div className="text-center py-16 text-muted-foreground">
            <UserIcon className="mx-auto size-12 mb-4 opacity-40" />
            <p className="text-lg font-medium">Nenhum usuário encontrado</p>
            <p className="text-sm mt-1">
              {search ? "Tente alterar os termos da busca." : "Nenhum usuário cadastrado ainda."}
            </p>
          </div>
        ) : (
          <div className="rounded-xl border bg-card overflow-hidden">
            {/* Desktop table */}
            <div className="hidden md:block">
              <table className="w-full">
                <thead>
                  <tr className="border-b bg-muted/50">
                    <th className="text-left px-6 py-3 text-xs font-medium uppercase text-muted-foreground tracking-wider">
                      Nome
                    </th>
                    <th className="text-left px-6 py-3 text-xs font-medium uppercase text-muted-foreground tracking-wider">
                      Email
                    </th>
                    <th className="text-left px-6 py-3 text-xs font-medium uppercase text-muted-foreground tracking-wider">
                      Cargo
                    </th>
                    {isAdmin && (
                      <th className="text-right px-6 py-3 text-xs font-medium uppercase text-muted-foreground tracking-wider">
                        Ações
                      </th>
                    )}
                  </tr>
                </thead>
                <tbody className="divide-y">
                  {filteredUsers.map((user) => (
                    <tr
                      key={user._id}
                      className="hover:bg-muted/30 transition-colors"
                    >
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          <div className="flex items-center justify-center size-9 rounded-full bg-primary/10 text-primary font-semibold text-sm">
                            {user.name?.charAt(0).toUpperCase()}
                          </div>
                          <span className="font-medium">{user.name}</span>
                        </div>
                      </td>
                      <td className="px-6 py-4 text-muted-foreground">
                        {user.email}
                      </td>
                      <td className="px-6 py-4">{roleBadge(user.role)}</td>
                      {isAdmin && (
                        <td className="px-6 py-4 text-right">
                          <div className="flex items-center justify-end gap-2">
                            <Button
                              variant="ghost"
                              size="icon-sm"
                              onClick={() => openEdit(user)}
                            >
                              <PencilSquareIcon className="size-4" />
                            </Button>
                            <Button
                              variant="ghost"
                              size="icon-sm"
                              className="text-destructive hover:text-destructive"
                              onClick={() => setDeleteTarget(user)}
                            >
                              <TrashIcon className="size-4" />
                            </Button>
                          </div>
                        </td>
                      )}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Mobile cards */}
            <div className="md:hidden divide-y">
              {filteredUsers.map((user) => (
                <div key={user._id} className="p-4 space-y-2">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="flex items-center justify-center size-9 rounded-full bg-primary/10 text-primary font-semibold text-sm">
                        {user.name?.charAt(0).toUpperCase()}
                      </div>
                      <div>
                        <p className="font-medium">{user.name}</p>
                        <p className="text-sm text-muted-foreground">{user.email}</p>
                      </div>
                    </div>
                    {roleBadge(user.role)}
                  </div>
                  {isAdmin && (
                    <div className="flex gap-2 pt-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => openEdit(user)}
                        className="gap-1"
                      >
                        <PencilSquareIcon className="size-3.5" />
                        Editar
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        className="gap-1 text-destructive hover:text-destructive"
                        onClick={() => setDeleteTarget(user)}
                      >
                        <TrashIcon className="size-3.5" />
                        Remover
                      </Button>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}
      </main>

      {/* Delete dialog */}
      <Dialog open={!!deleteTarget} onOpenChange={(o) => !o && setDeleteTarget(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Confirmar exclusão</DialogTitle>
            <DialogDescription>
              Tem certeza que deseja remover o usuário{" "}
              <strong>{deleteTarget?.name}</strong>? Essa ação não pode ser desfeita.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter className="gap-2">
            <DialogClose asChild>
              <Button variant="outline">Cancelar</Button>
            </DialogClose>
            <Button
              variant="destructive"
              onClick={handleDelete}
              disabled={actionLoading}
            >
              {actionLoading ? (
                <Loader2 className="size-4 animate-spin" />
              ) : (
                "Remover"
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Edit dialog */}
      <Dialog open={!!editTarget} onOpenChange={(o) => !o && setEditTarget(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Editar Usuário</DialogTitle>
            <DialogDescription>
              Atualize as informações do usuário.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">Nome</label>
              <Input
                value={editForm.name}
                onChange={(e) =>
                  setEditForm((f) => ({ ...f, name: e.target.value }))
                }
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">Email</label>
              <Input
                type="email"
                value={editForm.email}
                onChange={(e) =>
                  setEditForm((f) => ({ ...f, email: e.target.value }))
                }
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">Cargo</label>
              <select
                className="flex h-9 w-full rounded-md border border-input bg-background px-3 py-1 text-sm shadow-xs transition-colors focus-visible:outline-none focus-visible:ring-[3px] focus-visible:ring-ring/50 focus-visible:border-ring"
                value={editForm.role}
                onChange={(e) =>
                  setEditForm((f) => ({ ...f, role: e.target.value }))
                }
              >
                <option value="user">Usuário</option>
                <option value="admin">Admin</option>
              </select>
            </div>
          </div>
          <DialogFooter className="gap-2">
            <DialogClose asChild>
              <Button variant="outline">Cancelar</Button>
            </DialogClose>
            <Button onClick={handleEdit} disabled={actionLoading}>
              {actionLoading ? (
                <Loader2 className="size-4 animate-spin" />
              ) : (
                "Salvar"
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Add dialog */}
      <Dialog open={addOpen} onOpenChange={setAddOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Novo Usuário</DialogTitle>
            <DialogDescription>
              Preencha os dados para criar um novo usuário.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">Nome</label>
              <Input
                value={addForm.name}
                onChange={(e) =>
                  setAddForm((f) => ({ ...f, name: e.target.value }))
                }
                placeholder="Nome completo"
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">Email</label>
              <Input
                type="email"
                value={addForm.email}
                onChange={(e) =>
                  setAddForm((f) => ({ ...f, email: e.target.value }))
                }
                placeholder="email@exemplo.com"
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">Senha</label>
              <Input
                type="password"
                value={addForm.senha}
                onChange={(e) =>
                  setAddForm((f) => ({ ...f, senha: e.target.value }))
                }
                placeholder="••••••••"
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">Cargo</label>
              <select
                className="flex h-9 w-full rounded-md border border-input bg-background px-3 py-1 text-sm shadow-xs transition-colors focus-visible:outline-none focus-visible:ring-[3px] focus-visible:ring-ring/50 focus-visible:border-ring"
                value={addForm.role}
                onChange={(e) =>
                  setAddForm((f) => ({ ...f, role: e.target.value }))
                }
              >
                <option value="user">Usuário</option>
                <option value="admin">Admin</option>
              </select>
            </div>
          </div>
          <DialogFooter className="gap-2">
            <DialogClose asChild>
              <Button variant="outline">Cancelar</Button>
            </DialogClose>
            <Button onClick={handleAdd} disabled={actionLoading}>
              {actionLoading ? (
                <Loader2 className="size-4 animate-spin" />
              ) : (
                "Criar Usuário"
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}

export default UsersPage
