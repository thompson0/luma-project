"use client"

import { ShieldCheck, User as UserIcon } from "lucide-react"

export default function RoleBadge({ role }) {
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
