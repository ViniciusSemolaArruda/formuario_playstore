"use client"

import Image from "next/image"
import { FormEvent, useEffect, useState } from "react"

const PLAY_STORE_LINK =
  "https://play.google.com/store/apps/details?id=com.capadocia.ondetemeventorio"

type LeadResponse = {
  message?: string
  leadId?: string
  approved?: boolean
  error?: string
}

export default function HomePage() {
  const [email, setEmail] = useState("")
  const [accepted, setAccepted] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState(false)

  const [leadId, setLeadId] = useState<string | null>(null)
  const [approved, setApproved] = useState(false)

  // ⏳ novo contador
  const [waitSeconds, setWaitSeconds] = useState(0)

  async function handleSubmit(e: FormEvent) {
    e.preventDefault()
    setError(null)
    setSuccess(false)

    if (!accepted) {
      setError(
        "Você precisa aceitar os Termos de Serviço e a Política de Privacidade."
      )
      return
    }

    setIsLoading(true)

    try {
      const res = await fetch("/api/leads", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email }),
      })

      const data = (await res.json()) as LeadResponse

      if (!res.ok) {
        setError(data.error || "Erro ao enviar. Tente novamente.")
        return
      }

      setLeadId(data.leadId ?? null)
      setApproved(Boolean(data.approved))
      setSuccess(true)
      setEmail("")
      setAccepted(false)
      setWaitSeconds(0) // começa o contador
    } catch {
      setError("Erro de conexão. Tente novamente.")
    } finally {
      setIsLoading(false)
    }
  }

  // 🔄 Checa aprovação de 5 em 5 segundos
  useEffect(() => {
    if (!success || !leadId || approved) return

    const interval = setInterval(async () => {
      try {
        const res = await fetch(`/api/leads/${leadId}`, {
          method: "GET",
          cache: "no-store",
        })

        if (!res.ok) return
        const data = await res.json()
        if (data.lead?.approved) {
          setApproved(true)
          clearInterval(interval)
        }
      } catch (err) {
        console.error("Erro checando aprovação:", err)
      }
    }, 5000)

    return () => clearInterval(interval)
  }, [success, leadId, approved])

  // ⏳ contador de segundos enquanto aguarda liberação
  useEffect(() => {
    if (!success || approved) return

    const timer = setInterval(() => {
      setWaitSeconds((s) => s + 1)
    }, 1000)

    return () => clearInterval(timer)
  }, [success, approved])

  //------------------------------------------------------------------

  if (success) {
    return (
      <main className="min-h-screen flex items-center justify-center bg-slate-100 px-4">
        <div className="max-w-md w-full bg-white rounded-2xl shadow-lg p-6 text-center space-y-4">
          <div className="flex justify-center">
            <Image
              src="/logo01.png"
              alt="Logo Onde Tem Evento Rio?"
              width={420}
              height={120}
            />
          </div>

          <h1 className="text-xl font-semibold text-slate-900">
            E-mail recebido! 🎉
          </h1>

          {!approved ? (
            <>
              <p className="text-sm text-slate-700">
                Seu e-mail foi registrado com sucesso e está em análise.
              </p>
              <p className="text-xs text-slate-500">
                Mantenha esta página aberta. Assim que seu acesso for liberado,
                o botão para baixar o aplicativo será habilitado automaticamente.
              </p>

              <button
                className="inline-flex mt-2 items-center justify-center gap-3 rounded-full px-4 py-2 text-sm font-medium bg-slate-300 text-slate-600 cursor-wait"
                disabled
              >
                {/* spinner */}
                <span
                  className="h-4 w-4 rounded-full border-2 border-slate-500 border-t-transparent animate-spin"
                />
                <span>Aguardando liberação...</span>

                {/* contador de segundos */}
                <span className="text-xs text-slate-500">
                  ({waitSeconds}s)
                </span>
              </button>
            </>
          ) : (
            <>
              <p className="text-sm text-slate-700">
                Seu acesso foi liberado! Agora você já pode baixar o aplicativo
                Onde Tem Evento Rio pela Google Play.
              </p>

              <a
                href={PLAY_STORE_LINK}
                target="_blank"
                rel="noreferrer"
                className="inline-flex mt-2 items-center justify-center rounded-full px-4 py-2 text-sm font-medium bg-emerald-600 text-white hover:bg-emerald-700 transition"
              >
                Abrir página do app na Google Play
              </a>
            </>
          )}
        </div>
      </main>
    )
  }

  //------------------------------------------------------------------

  return (
    <main className="min-h-screen flex items-center justify-center bg-slate-100 px-4">
      <div className="max-w-md w-full bg-white rounded-2xl shadow-lg p-6 space-y-6">
        <div className="flex flex-col items-center gap-2">
          <Image
            src="/logo01.png"
            alt="Logo Onde Tem Evento Rio?"
            width={420}
            height={120}
          />
          <h1 className="text-xl font-semibold text-slate-900 text-center">
            Informe seu e-mail Gmail
          </h1>
        </div>

        <p className="text-sm text-slate-700 text-center">
          Coloque abaixo a <strong>conta Gmail vinculada à sua Google Play</strong>.<br />
          Este e-mail será utilizado exclusivamente para liberar o acesso ao aplicativo.
        </p>

        <form onSubmit={handleSubmit} className="space-y-4">
          <label className="block text-sm font-medium text-slate-800">
            E-mail Gmail
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="exemplo@gmail.com"
              className="mt-1 w-full rounded-lg border border-slate-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
            />
          </label>

          <label className="flex items-start gap-2 text-xs text-slate-600">
            <input
              type="checkbox"
              checked={accepted}
              onChange={(e) => setAccepted(e.target.checked)}
              className="mt-1"
            />
            <span>
              Eu li e aceito os{" "}
              <a href="/termos" className="text-emerald-600 underline" target="_blank">
                Termos de Serviço
              </a>{" "}
              e a{" "}
              <a href="/privacidade" className="text-emerald-600 underline" target="_blank">
                Política de Privacidade
              </a>.
            </span>
          </label>

          {error && (
            <p className="text-xs text-red-600 bg-red-50 border border-red-100 rounded-md px-2 py-1">
              {error}
            </p>
          )}

          <button
            type="submit"
            disabled={isLoading}
            className="w-full inline-flex items-center justify-center rounded-full px-4 py-2.5 text-sm font-semibold bg-emerald-600 text-white hover:bg-emerald-700 disabled:opacity-60 disabled:cursor-not-allowed transition"
          >
            {isLoading ? "Enviando..." : "Enviar"}
          </button>
        </form>

        <p className="text-[11px] text-slate-400 text-center">
          Usaremos este e-mail exclusivamente para fins de validação e liberação do aplicativo.
        </p>
      </div>
    </main>
  )
}
