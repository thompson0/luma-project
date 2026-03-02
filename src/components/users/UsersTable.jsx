"use client"

import { Button } from "@/components/ui/button"
import { PencilSquareIcon, TrashIcon } from "@heroicons/react/24/outline"
import { User as UserIcon } from "lucide-react"
import RoleBadge from "./RoleBadge"

export default function UsersTable({ users, isAdmin, onEdit, onDelete }) {
  if (users.length === 0) {
    return (
      <div className="text-center py-16 text-muted-foreground">
        <UserIcon className="mx-auto size-12 mb-4 opacity-40" />
        <p className="text-lg font-medium">Nenhum usuário encontrado</p>
        <p className="text-sm mt-1">Tente alterar os termos da busca.</p>
      </div>
    )
  }

  return (
    <div className="rounded-xl border bg-card overflow-hidden">
      {/* Desktop */}
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
            {users.map((user) => (
              <tr key={user._id} className="hover:bg-muted/30 transition-colors">
                <td className="px-6 py-4">
                  <div className="flex items-center gap-3">
                    <div className="flex items-center justify-center size-9 rounded-full bg-primary/10 text-primary font-semibold text-sm">
                      {user.name?.charAt(0).toUpperCase()}
                    </div>
                    <span className="font-medium">{user.name}</span>
                  </div>
                </td>
                <td className="px-6 py-4 text-muted-foreground">{user.email}</td>
                <td className="px-6 py-4">
                  <RoleBadge role={user.role} />
                </td>
                {isAdmin && (
                  <td className="px-6 py-4 text-right">
                    <div className="flex items-center justify-end gap-2">
                      <Button variant="ghost" size="icon-sm" onClick={() => onEdit(user)}>
                        <PencilSquareIcon className="size-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon-sm"
                        className="text-destructive hover:text-destructive"
                        onClick={() => onDelete(user)}
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

      {/* Mobile */}
      <div className="md:hidden divide-y">
        {users.map((user) => (
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
              <RoleBadge role={user.role} />
            </div>
            {isAdmin && (
              <div className="flex gap-2 pt-2">
                <Button variant="outline" size="sm" onClick={() => onEdit(user)} className="gap-1">
                  <PencilSquareIcon className="size-3.5" />
                  Editar
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  className="gap-1 text-destructive hover:text-destructive"
                  onClick={() => onDelete(user)}
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
  )
}
