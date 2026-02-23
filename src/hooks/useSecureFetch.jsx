"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { useAlert } from "@/context/AlertContext"

function getCsrfToken() {
  if (typeof document === "undefined") return ""
  const match = document.cookie
    .split("; ")
    .find((c) => c.startsWith("csrf_token="))
  return match ? match.split("=")[1] : ""
}

function getSessionFromCookie() {
  if (typeof document === "undefined") return null
  try {
    const sessionCookie = document.cookie
      .split("; ")
      .find((c) => c.startsWith("luma.session_data="))
    
    if (!sessionCookie) return null
    
    const cookieValue = sessionCookie.split("=")[1]
    if (!cookieValue) return null
    
    const decoded = decodeURIComponent(cookieValue)
    const parsed = JSON.parse(decoded)
    
    return parsed
  } catch (err) {
    console.error("Erro ao decodificar sessão do cookie:", err)
    return null
  }
}

async function fetchSession() {
  try {
    const res = await fetch("/api/v1/auth/get-session", {
      method: "GET",
      credentials: "include",
    })
    if (!res.ok) return null
    const data = await res.json()
    return data?.session ? data : null
  } catch (err) {
    console.error("Erro ao buscar sessão:", err)
    return null
  }
}

export function useSecureFetch() {
  const [loading, setLoading] = useState(false)
  const router = useRouter()
  const { triggerAlert } = useAlert()

  async function secureFetch(url, options = {}, { refresh = false, successMsg, errorMsg } = {}) {
    setLoading(true)
    try {
      const csrf = getCsrfToken()

      const res = await fetch(url, {
        ...options,
        headers: {
          "Content-Type": "application/json",
          "x-csrf-token": csrf,
          ...(options.headers || {}),
        },
      })

      if (!res.ok) {
        const msg = (await res.text().catch(() => "")) || errorMsg || "Erro na operação."
        triggerAlert("error", "Erro!", msg)
        return null
      }

      if (refresh) await router.refresh()
      if (successMsg) triggerAlert("success", "Sucesso!", successMsg)

      return res
    } catch (err) {
      console.error(err)
      triggerAlert("error", "Erro!", errorMsg || "Falha de conexão.")
      return null
    } finally {
      setLoading(false)
    }
  }

  return { secureFetch, loading, getSessionFromCookie, fetchSession }
}