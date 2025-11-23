"use client"

import Image from "next/image"
import { FormEvent, useState } from "react"

const PLAY_STORE_LINK =
  "https://play.google.com/store/apps/details?id=com.capadocia.ondetemeventorio"

export default function HomePage() {
  const [email, setEmail] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState(false)

  async function handleSubmit(e: FormEvent) {
    e.preventDefault()
    setError(null)
    setSuccess(false)
    setIsLoading(true)

    try {
      const res = await fetch("/api/leads", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email }),
      })

      const data = await res.json()

      if (!res.ok) {
        setError(data.error || "Erro ao enviar. Tente novamente.")
        return
      }

      setSuccess(true)
      setEmail("")
    } catch (err) {
      console.error(err)
      setError("Erro de conexão. Tente novamente.")
    } finally {
      setIsLoading(false)
    }
  }

  if (success) {
  return (
    <main className="min-h-screen flex items-center justify-center bg-slate-100 px-4">
      <div className="max-w-md w-full bg-white rounded-2xl shadow-lg p-6 text-center space-y-4">
        {/* LOGO */}
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

        <p className="text-sm text-slate-700">
          Seu e-mail foi registrado com sucesso.  
          Assim que liberarmos o acesso no Google Play Console,
          você receberá o link oficial para baixar o aplicativo.
        </p>

        <p className="text-xs text-slate-500">
          Agradecemos pelo interesse em testar o aplicativo Onde Tem Evento Rio.
        </p>

        <a
          href={PLAY_STORE_LINK}
          target="_blank"
          rel="noreferrer"
          className="inline-flex mt-2 items-center justify-center rounded-full px-4 py-2 text-sm font-medium bg-emerald-600 text-white hover:bg-emerald-700 transition"
        >
          Abrir página do app na Google Play
        </a>
      </div>
    </main>
  )
}


  return (
    <main className="min-h-screen flex items-center justify-center bg-slate-100 px-4">
      <div className="max-w-md w-full bg-white rounded-2xl shadow-lg p-6 space-y-6">
        {/* LOGO */}
        <div className="flex flex-col items-center gap-2">
          <Image
            src="/logo01.png" // coloque sua logo em public/logo.png
            alt="Logo Onde Tem Evento Rio?"
            width={420}
            height={120}
          />
          <h1 className="text-xl font-semibold text-slate-900 text-center">
            Informe seu e-mail Gmail
          </h1>
        </div>

        <p className="text-sm text-slate-700 text-center">
          Coloque abaixo a <strong>conta Gmail vinculada à sua Google Play</strong>.
          Após enviar, você receberá um e-mail com o link para baixar o
          aplicativo <strong>Onde Tem Evento Rio?</strong>
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
          Usaremos este e-mail apenas para envio do link de download do
          aplicativo.
        </p>
      </div>
    </main>
  )
}
