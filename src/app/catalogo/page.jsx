"use client"

import NavHome from "@/components/NavHome"
import { useSession } from "@/context/SessionContext"
import PecasCard from "@/components/PecasCards"

function Catalogo() {
  const { user, isAdmin } = useSession()

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <NavHome />
      <main className="flex-1 w-full max-w-7xl mx-auto px-6 py-12 ">
        <div className="mb-10 flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold mt-7">
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