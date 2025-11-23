"use client"

import { useEffect, useState } from "react"

type Lead = {
  id: string
  email: string
  createdAt: string
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

  useEffect(() => {
    // carrega imediatamente
    loadLeads()

    // atualiza de 5 em 5 segundos
    const interval = setInterval(() => {
      loadLeads()
    }, 5000)

    return () => clearInterval(interval)
  }, [])

  return (
    <main className="min-h-screen bg-slate-100 px-4 py-8">
      <div className="max-w-2xl mx-auto bg-white rounded-2xl shadow-lg p-6 space-y-4">
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
