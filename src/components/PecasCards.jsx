"use client";
import { useRouter } from "next/navigation"

import { useEffect, useState } from "react";
import { ProgressDemo } from "@/components/ProgressDemo";
import { useRefresh } from "@/context/RefreshContext";
import AddPecas from "./AddPecas";
import EditPecas from "./EditPecas";
import DeletePecas from "./DeletePecas";
import Filter from "./Filter";
import SearchBar from "./SearchBar";
import { useSession } from "@/context/SessionContext";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel"
import { Input } from "./ui/input";
import Link from "next/link";
function PecasCard() {
  const [pecas, setPecas] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filterQuery, setFilterQuery] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const { refreshKey } = useRefresh();
  const { isAdmin } = useSession();
  const router = useRouter()

  useEffect(() => {
    async function fetchData() {
      try {
        let params = filterQuery ? `${filterQuery}&k=${refreshKey}` : `k=${refreshKey}`;
        if (searchQuery) params += `&nome=${encodeURIComponent(searchQuery)}`;
        const pecasRes = await fetch(`/api/v1/pecas?${params}`);

        if (pecasRes.ok) {
          const data = await pecasRes.json();
          setPecas(data.data || data);
        }
      } catch (error) {
        console.error("Erro:", error);
      } finally {
        setLoading(false);
      }
    }

    fetchData();
  }, [refreshKey, filterQuery, searchQuery]);

  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center gap-3 flex-wrap">
          <Filter
          onFilter={(q) => {
            if (q === filterQuery) return;
            setFilterQuery(q);
          }}
        />
        <div className="flex-1 flex justify-center">
          <SearchBar
            onSearch={(q) => {
              if (q === searchQuery) return;
              setSearchQuery(q);
            }}
            placeholder="Buscar peças pelo nome..."
          />
        </div>
      
        {isAdmin && (
          <div className="ml-auto">
            <AddPecas
              onCreated={(nova) => {
                if (!nova) return;
                setPecas((prev) => [nova, ...prev]);
              }}
            />
          </div>
        )}
      </div>

      {loading ? (
        <div>
          <p className="text-center mt-10">Carregando peças...</p>
          <ProgressDemo />
        </div>
      ) : pecas.length === 0 ? (
        <p className="text-center mt-10 text-muted-foreground">
          {isAdmin
            ? 'Nenhuma peça encontrada. Clique em "Nova Peça" para adicionar.'
            : 'Nenhuma peça encontrada.'}
        </p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8">
          {pecas.map((p) => (
            <div
              key={p._id || p.id}
              className="w-full h-80 rounded-2xl shadow-md hover:shadow-lg transition-all duration-300 flex flex-col overflow-hidden bg-card"
            >
              <div className="flex-1 bg-muted p-4">
                <Carousel className="relative w-full h-full overflow-hidden">
                  <CarouselContent>
                    {(p.fotos?.length ? p.fotos : ["/placeholder.png"]).map((foto, index) => (
                      <CarouselItem
                        key={index}
                        className="flex items-center justify-center"
                      >
                        <img
                          src={foto}
                          alt={`${p.name}-${index}`}
                          className="w-56 h-40 object-contain transition-transform duration-300 hover:scale-105"
                        />
                      </CarouselItem>
                    ))}
                  </CarouselContent>

                  {p.fotos?.length > 1 && (
                    <>
                      <CarouselPrevious className="left-2" />
                      <CarouselNext className="right-2" />
                    </>
                  )}
                </Carousel>
              </div>
              <div className="p-4 border-t space-y-2">
                <Link href={`/catalogo/peca/${p._id || p.id}`}>
                  <h2 className="text-lg font-semibold truncate hover:text-blue-600 transition-colors">
                    {p.name}
                  </h2>
                </Link>


                {p.materials && (
                  <p className="text-sm text-muted-foreground">
                    Material: {p.materials}
                  </p>
                )}

                <div className="flex items-center justify-between pt-2">
                  {isAdmin && (
                    <p className="text-lg font-bold text-emerald-600">
                      R$ {p.preco?.toFixed(2) || "0.00"}
                    </p>
                  )}

                  {isAdmin && (
                    <div className="flex items-center gap-2">
                      <EditPecas
                        id={p._id || p.id}
                        onUpdated={(updated) => {
                          if (!updated) return;
                          setPecas((prev) =>
                            prev.map((item) =>
                              String(item._id || item.id) === String(updated._id || updated.id) ? { ...item, ...updated } : item
                            )
                          );
                        }}
                      />
                      <DeletePecas
                        id={p._id || p.id}
                        nome={p.name}
                        onDeleted={(deletedId) => {
                          setPecas((prev) =>
                            prev.filter((item) => String(item._id || item.id) !== String(deletedId))
                          );
                        }}
                      />
                    </div>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default PecasCard;