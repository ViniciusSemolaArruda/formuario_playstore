import { NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"

// LISTAR E-MAILS (para o painel)
export async function GET() {
  try {
    const leads = await prisma.emailLead.findMany({
      orderBy: { createdAt: "desc" },
    })

    return NextResponse.json({ leads })
  } catch (error) {
    console.error("ERRO NA ROTA GET /api/leads:", error)
    return NextResponse.json(
      { error: "Erro ao buscar e-mails." },
      { status: 500 }
    )
  }
}

// SALVAR E-MAIL (formulário)
export async function POST(request: Request) {
  try {
    const body = await request.json()
    const email = (body.email as string | undefined)?.trim()

    if (!email) {
      return NextResponse.json(
        { error: "E-mail é obrigatório." },
        { status: 400 }
      )
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(email)) {
      return NextResponse.json(
        { error: "Informe um e-mail válido." },
        { status: 400 }
      )
    }

    const lead = await prisma.emailLead.upsert({
      where: { email },
      update: {},
      create: { email },
    })

    return NextResponse.json(
      { message: "E-mail registrado com sucesso.", leadId: lead.id },
      { status: 201 }
    )
  } catch (error) {
    console.error("ERRO NA ROTA POST /api/leads:", error)
    return NextResponse.json(
      { error: "Erro interno ao salvar o e-mail." },
      { status: 500 }
    )
  }
}
