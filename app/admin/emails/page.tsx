"use client"

import { useEffect, useState } from "react"

type Lead = {
  id: string
  email: string
  createdAt: string
  approved: boolean
}

type LeadsResponse = {
  leads?: Lead[]
  error?: string
}

export default function EmailsAdminPage() {
  const [leads, setLeads] = useState<Lead[]>([])
  const [isLoading, setIsLoading] = useState<boolean>(true)
  const [error, setError] = useState<string | null>(null)

  async function loadLeads() {
    try {
      setError(null)

      const res = await fetch("/api/leads", {
        method: "GET",
        cache: "no-store",
      })

      const data = (await res.json()) as LeadsResponse

      if (!res.ok) {
        throw new Error(data.error || "Erro ao buscar e-mails.")
      }

      setLeads(data.leads ?? [])
    } catch (err: unknown) {
      console.error("Erro carregando leads:", err)

      if (err instanceof Error) {
        setError(err.message)
      } else {
        setError("Erro ao carregar e-mails.")
      }
    } finally {
      setIsLoading(false)
    }
  }

  async function approveLead(id: string) {
    try {
      const res = await fetch(`/api/leads/${id}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ approved: true }),
      })

      const data = await res.json()

      if (!res.ok) {
        throw new Error(data.error || "Erro ao aprovar e-mail.")
      }

      setLeads((prev) =>
        prev.map((lead) =>
          lead.id === id ? { ...lead, approved: true } : lead
        )
      )
    } catch (err: unknown) {
      console.error("Erro aprovando lead:", err)
      // você pode exibir um toast, etc
    }
  }

  useEffect(() => {
    loadLeads()
    const interval = setInterval(loadLeads, 5000)
    return () => clearInterval(interval)
  }, [])

  return (
    <main className="min-h-screen bg-slate-100 px-4 py-8">
      <div className="max-w-3xl mx-auto bg-white rounded-2xl shadow-lg p-6 space-y-4">
        <h1 className="text-xl font-semibold text-slate-900">
          E-mails cadastrados (teste fechado)
        </h1>

        <p className="text-sm text-slate-600">
          Esta página recarrega automaticamente a lista a cada{" "}
          <strong>5 segundos</strong>.
        </p>

        {isLoading && <p className="text-sm text-slate-500">Carregando...</p>}

        {error && (
          <p className="text-sm text-red-600 bg-red-50 border border-red-100 rounded-md px-3 py-2">
            {error}
          </p>
        )}

        {!isLoading && leads.length === 0 && !error && (
          <p className="text-sm text-slate-500">
            Ainda não há e-mails cadastrados.
          </p>
        )}

        {leads.length > 0 && (
          <div className="border border-slate-200 rounded-xl overflow-hidden">
            <table className="w-full text-sm">
              <thead className="bg-slate-50">
                <tr>
                  <th className="text-left px-3 py-2 border-b border-slate-200">
                    E-mail
                  </th>
                  <th className="text-left px-3 py-2 border-b border-slate-200">
                    Data/Hora
                  </th>
                  <th className="text-left px-3 py-2 border-b border-slate-200">
                    Status
                  </th>
                  <th className="text-left px-3 py-2 border-b border-slate-200">
                    Ação
                  </th>
                </tr>
              </thead>
              <tbody>
                {leads.map((lead) => (
                  <tr key={lead.id} className="odd:bg-white even:bg-slate-50">
                    <td className="px-3 py-2 border-b border-slate-100">
                      {lead.email}
                    </td>
                    <td className="px-3 py-2 border-b border-slate-100 text-xs text-slate-500">
                      {new Date(lead.createdAt).toLocaleString("pt-BR")}
                    </td>
                    <td className="px-3 py-2 border-b border-slate-100 text-xs">
                      {lead.approved ? (
                        <span className="inline-flex items-center gap-1 rounded-full bg-emerald-50 px-2 py-1 text-[11px] font-medium text-emerald-700">
                          ✅ Aprovado
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1 rounded-full bg-amber-50 px-2 py-1 text-[11px] font-medium text-amber-700">
                          ⏳ Pendente
                        </span>
                      )}
                    </td>
                    <td className="px-3 py-2 border-b border-slate-100 text-xs">
                      {!lead.approved && (
                        <button
                          onClick={() => approveLead(lead.id)}
                          className="rounded-full bg-emerald-600 px-3 py-1 text-[11px] font-semibold text-white hover:bg-emerald-700"
                        >
                          Aprovar
                        </button>
                      )}
                      {lead.approved && (
                        <span className="text-slate-400 text-[11px]">
                          ✔ Já aprovado
                        </span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </main>
  )
}
