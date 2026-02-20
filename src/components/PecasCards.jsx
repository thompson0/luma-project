"use client";

import { useEffect, useState } from "react";
import { ProgressDemo } from "@/components/Home/ProgressDemo";
import { useRefresh } from "@/context/RefreshContext";
import AddPecas from "./AddPecas";
import EditPecas from "./EditPecas";
import DeletePecas from "./DeletePecas";

function PecasCard() {
  const [pecas, setPecas] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isAdmin, setIsAdmin] = useState(false);
  const { refreshKey } = useRefresh();

  useEffect(() => {
    async function fetchData() {
      try {
        const [pecasRes, userRes] = await Promise.all([
          fetch(`/api/v1/pecas?k=${refreshKey}`),
          fetch("/api/v1/auth/session", { credentials: 'include' })
        ]);

        if (pecasRes.ok) {
          const data = await pecasRes.json();
          setPecas(data.data || data);
        }

        if (userRes.ok) {
          const userData = await userRes.json();
          setIsAdmin(userData.user?.role === "admin");
        }
      } catch (error) {
        console.error("Erro:", error);
      } finally {
        setLoading(false);
      }
    }

    fetchData();
  }, [refreshKey]);

  if (loading)
    return (
      <div>
        <p className="text-center mt-10">Carregando peças...</p>
        <ProgressDemo />
      </div>
    );

  return (
    <div className="flex flex-col gap-6">
      {isAdmin && (
        <div className="flex justify-end">
          <AddPecas
            onCreated={(nova) => {
              if (!nova) return;
              setPecas((prev) => [nova, ...prev]);
            }}
          />
        </div>
      )}

      {pecas.length === 0 ? (
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
              <div className="flex-1 flex items-center justify-center bg-muted p-4">
                <img
                  src={p.fotos?.[0] || "/placeholder.png"}
                  alt={p.name}
                  className="w-56 h-40 object-contain transition-transform duration-300 hover:scale-105"
                />
              </div>

              <div className="p-4 border-t space-y-2">
                <h2 className="text-lg font-semibold truncate hover:text-blue-600 transition-colors">
                  {p.name}
                </h2>
                
                {p.materials && (
                  <p className="text-sm text-muted-foreground">
                    Material: {p.materials}
                  </p>
                )}

                <div className="flex items-center justify-between pt-2">
                  <p className="text-lg font-bold text-emerald-600">
                    R$ {p.preco?.toFixed(2) || "0.00"}
                  </p>
                  
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