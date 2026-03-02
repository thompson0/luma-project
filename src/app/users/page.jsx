"use client"

import { useState, useEffect, useCallback } from "react"
import { useRouter } from "next/navigation"
import NavHome from "@/components/NavHome"
import { useSecureFetch } from "@/hooks/useSecureFetch"
import { useSession } from "@/context/SessionContext"
import { useAlert } from "@/context/AlertContext"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { MagnifyingGlassIcon, UserPlusIcon } from "@heroicons/react/24/outline"
import { Loader2 } from "lucide-react"

import UserStats from "@/components/users/UserStats"
import UsersTable from "@/components/users/UsersTable"
import AddUserDialog from "@/components/users/AddUserDialog"
import EditUserDialog from "@/components/users/EditUserDialog"
import DeleteUserDialog from "@/components/users/DeleteUserDialog"

function UsersPage() {
  const [users, setUsers] = useState([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState("")
  const [deleteTarget, setDeleteTarget] = useState(null)
  const [editTarget, setEditTarget] = useState(null)
  const [editForm, setEditForm] = useState({ name: "", email: "", role: "" })
  const [addOpen, setAddOpen] = useState(false)
  const [addForm, setAddForm] = useState({ name: "", email: "", password: "", role: "user" })
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
      const res = await fetch("/api/v1/auth/sign-up/email", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: addForm.name,
          email: addForm.email,
          password: addForm.password,
          role: addForm.role,
        }),
      })

      if (!res.ok) {
        const err = await res.text().catch(() => "")
        triggerAlert("error", "Erro!", err || "Erro ao criar usuário.")
        return
      }

      triggerAlert("success", "Sucesso!", "Usuário criado com sucesso.")
      setAddForm({ name: "", email: "", password: "", role: "user" })
      setAddOpen(false)
      await loadUsers()
    } catch {
      triggerAlert("error", "Erro!", "Falha ao criar usuário.")
    } finally {
      setActionLoading(false)
    }
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

        <UserStats users={users} />
        <UsersTable
          users={filteredUsers}
          isAdmin={isAdmin}
          onEdit={openEdit}
          onDelete={setDeleteTarget}
        />
      </main>

      <DeleteUserDialog
        user={deleteTarget}
        loading={actionLoading}
        onConfirm={handleDelete}
        onClose={() => setDeleteTarget(null)}
      />
      <EditUserDialog
        user={editTarget}
        form={editForm}
        setForm={setEditForm}
        loading={actionLoading}
        onConfirm={handleEdit}
        onClose={() => setEditTarget(null)}
      />
      <AddUserDialog
        open={addOpen}
        setOpen={setAddOpen}
        form={addForm}
        setForm={setAddForm}
        loading={actionLoading}
        onConfirm={handleAdd}
      />
    </div>
  )
}

export default UsersPage
