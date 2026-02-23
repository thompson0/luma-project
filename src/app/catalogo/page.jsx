"use client"

import { useState, useEffect } from "react"
import NavHome from "@/components/NavHome"
import { useSecureFetch } from "@/hooks/useSecureFetch"
import PecasCard from "@/components/PecasCards"

function Catalogo() {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)
  const { fetchSession } = useSecureFetch()

  useEffect(() => {
    async function checkSession() {
      const session = await fetchSession()
      setUser(session?.user || null)
      setLoading(false)
    }
    checkSession()
  }, [])

  const isAdmin = user?.role === "admin"

  return (
    <div className="min-h-screen flex flex-col bg-background">
      
      {/* Navbar */}
      <NavHome />

      {/* Conteúdo */}
      <main className="flex-1 w-full max-w-7xl mx-auto px-6 py-12">
        
        {/* Header */}
        <div className="mb-10 flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold">
              Catálogo de Peças
            </h1>
            <p className="text-muted-foreground mt-1">
              Visualize e gerencie todas as peças cadastradas
            </p>
          </div>

        </div>


        <section>
          <PecasCard />
        </section>

      </main>

    </div>
  )
}

export default Catalogo