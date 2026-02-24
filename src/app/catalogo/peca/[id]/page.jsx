"use client"

import { useEffect, useState } from "react"
import { useParams, useRouter } from "next/navigation"
import Image from "next/image"
import Link from "next/link"
import NavHome from "@/components/NavHome"
import { ProgressDemo } from "@/components/ProgressDemo"
import { Button } from "@/components/ui/button"
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel"
import { ArrowLeftIcon, CalendarIcon } from "@heroicons/react/24/outline"
import { Package, Gem, DollarSign } from "lucide-react"

function PecaDetalhes() {
  const { id } = useParams()
  const router = useRouter()
  const [peca, setPeca] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [selectedImage, setSelectedImage] = useState(0)

  useEffect(() => {
    if (!id) return

    async function fetchPeca() {
      try {
        const res = await fetch(`/api/v1/pecas/${id}`)
        if (!res.ok) {
          setError("Peça não encontrada.")
          return
        }
        const json = await res.json()
        setPeca(json.data || json)
      } catch (err) {
        console.error("Erro ao buscar peça:", err)
        setError("Erro ao carregar a peça.")
      } finally {
        setLoading(false)
      }
    }

    fetchPeca()
  }, [id])

  const fotos = peca?.fotos?.length ? peca.fotos : ["/placeholder.png"]

  if (loading) {
    return (
      <div className="min-h-screen flex flex-col bg-background">
        <NavHome />
        <main className="flex-1 flex items-center justify-center">
          <div className="w-full max-w-md">
            <p className="text-center mb-4 text-muted-foreground">Carregando peça...</p>
            <ProgressDemo />
          </div>
        </main>
      </div>
    )
  }

  if (error || !peca) {
    return (
      <div className="min-h-screen flex flex-col bg-background">
        <NavHome />
        <main className="flex-1 flex items-center justify-center">
          <div className="text-center space-y-4">
            <p className="text-xl text-muted-foreground">{error || "Peça não encontrada."}</p>
            <Link href="/catalogo">
              <Button variant="outline" className="gap-2">
                <ArrowLeftIcon className="w-4 h-4" />
                Voltar ao catálogo
              </Button>
            </Link>
          </div>
        </main>
      </div>
    )
  }

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <NavHome />

      <main className="flex-1 w-full max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 pt-24 pb-16">
        {/* Voltar */}
        <Link
          href="/catalogo"
          className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors mb-8"
        >
          <ArrowLeftIcon className="w-4 h-4" />
          Voltar ao catálogo
        </Link>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-16">
          {/* Galeria de fotos */}
          <div className="space-y-4">
            {/* Imagem principal */}
            <div className="relative w-full aspect-square rounded-2xl overflow-hidden bg-muted border border-border shadow-sm">
              <img
                src={fotos[selectedImage]}
                alt={`${peca.name} - foto ${selectedImage + 1}`}
                className="w-full h-full object-contain p-4 transition-all duration-300"
              />
            </div>

            {/* Thumbnails */}
            {fotos.length > 1 && (
              <div className="flex gap-3 justify-center">
                {fotos.map((foto, index) => (
                  <button
                    key={index}
                    onClick={() => setSelectedImage(index)}
                    className={`relative w-20 h-20 rounded-xl overflow-hidden border-2 transition-all duration-200 ${
                      selectedImage === index
                        ? "border-primary ring-2 ring-primary/20 shadow-md"
                        : "border-border hover:border-muted-foreground/40"
                    }`}
                  >
                    <img
                      src={foto}
                      alt={`${peca.name} - miniatura ${index + 1}`}
                      className="w-full h-full object-contain p-1"
                    />
                  </button>
                ))}
              </div>
            )}

         
     
          </div>

          {/* Informações da peça */}
          <div className="flex flex-col justify-center space-y-8">
            {/* Nome */}
            <div>
              <h1 className="text-3xl sm:text-4xl font-bold tracking-tight text-foreground">
                {peca.name}
              </h1>
            </div>

            {/* Preço */}
            <div className="flex items-center gap-3">
              <div className="flex items-center justify-center w-12 h-12 rounded-xl bg-emerald-100 dark:bg-emerald-900/30">
                <DollarSign className="w-6 h-6 text-emerald-600 dark:text-emerald-400" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Preço</p>
                <p className="text-3xl font-bold text-emerald-600 dark:text-emerald-400">
                  R$ {peca.preco?.toFixed(2) || "0,00"}
                </p>
              </div>
            </div>

            {/* Detalhes */}
            <div className="space-y-4">
              <h2 className="text-lg font-semibold text-foreground">Detalhes</h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {/* Material */}
                {peca.materials && (
                  <div className="flex items-start gap-3 p-4 rounded-xl bg-card border border-border">
                    <div className="flex items-center justify-center w-10 h-10 rounded-lg bg-primary/10">
                      <Gem className="w-5 h-5 text-primary" />
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">Material</p>
                      <p className="font-medium text-foreground">{peca.materials}</p>
                    </div>
                  </div>
                )}

                {/* Fotos */}
                <div className="flex items-start gap-3 p-4 rounded-xl bg-card border border-border">
                  <div className="flex items-center justify-center w-10 h-10 rounded-lg bg-primary/10">
                    <Package className="w-5 h-5 text-primary" />
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Fotos</p>
                    <p className="font-medium text-foreground">
                      {peca.fotos?.length || 0} de 3
                    </p>
                  </div>
                </div>

                {/* Data de cadastro */}
                {peca.createdAt && (
                  <div className="flex items-start gap-3 p-4 rounded-xl bg-card border border-border">
                    <div className="flex items-center justify-center w-10 h-10 rounded-lg bg-primary/10">
                      <CalendarIcon className="w-5 h-5 text-primary" />
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">Cadastrada em</p>
                      <p className="font-medium text-foreground">
                        {new Date(peca.createdAt).toLocaleDateString("pt-BR", {
                          day: "2-digit",
                          month: "long",
                          year: "numeric",
                        })}
                      </p>
                    </div>
                  </div>
                )}

                {peca.updatedAt && peca.updatedAt !== peca.createdAt && (
                  <div className="flex items-start gap-3 p-4 rounded-xl bg-card border border-border">
                    <div className="flex items-center justify-center w-10 h-10 rounded-lg bg-primary/10">
                      <CalendarIcon className="w-5 h-5 text-primary" />
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">Atualizada em</p>
                      <p className="font-medium text-foreground">
                        {new Date(peca.updatedAt).toLocaleDateString("pt-BR", {
                          day: "2-digit",
                          month: "long",
                          year: "numeric",
                        })}
                      </p>
                    </div>
                  </div>
                )}
              </div>
            </div>

  
       
          </div>
        </div>
      </main>
    </div>
  )
}

export default PecaDetalhes
