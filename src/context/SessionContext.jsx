"use client"

import { createContext, useContext, useState, useEffect, useCallback, useMemo } from "react"
import { useRefresh } from "@/context/RefreshContext"

const SessionContext = createContext({
  session: null,
  user: null,
  isAdmin: false,
  isLoggedIn: false,
  sessionLoading: true,
  refreshSession: () => {},
})

export function SessionProvider({ children }) {
  const [session, setSession] = useState(null)
  const [sessionLoading, setSessionLoading] = useState(true)
  const { refreshKey } = useRefresh()

  const loadSession = useCallback(async () => {
    try {
      const res = await fetch("/api/v1/auth/get-session", {
        method: "GET",
        credentials: "include",
        cache: "no-store",
      })
      if (!res.ok) {
        setSession(null)
        return
      }
      const data = await res.json()
      setSession(data?.session ? data : null)
    } catch (err) {
      console.error("Erro ao buscar sessão:", err)
      setSession(null)
    } finally {
      setSessionLoading(false)
    }
  }, [])

  useEffect(() => {
    loadSession()
  }, [refreshKey, loadSession])

  const value = useMemo(() => ({
    session,
    user: session?.user || null,
    isAdmin: session?.user?.role === "admin",
    isLoggedIn: !!session,
    sessionLoading,
    refreshSession: loadSession,
  }), [session, sessionLoading, loadSession])

  return (
    <SessionContext.Provider value={value}>
      {children}
    </SessionContext.Provider>
  )
}

export function useSession() {
  return useContext(SessionContext)
}
