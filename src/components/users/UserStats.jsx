"use client"

export default function UserStats({ users }) {
  return (
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
  )
}
