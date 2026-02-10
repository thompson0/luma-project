"use client"

import { createContext, useContext, useMemo, useState, useCallback } from "react"

const RefreshContext = createContext({ refreshKey: 0, triggerRefresh: () => {} })

export function RefreshProvider({ children }) {
  const [refreshKey, setRefreshKey] = useState(0)

  const triggerRefresh = useCallback(() => {
    setRefreshKey((k) => k + 1)
  }, [])

  const value = useMemo(() => ({ refreshKey, triggerRefresh }), [refreshKey, triggerRefresh])

  return <RefreshContext.Provider value={value}>{children}</RefreshContext.Provider>
}

export function useRefresh() {
  return useContext(RefreshContext)
}
