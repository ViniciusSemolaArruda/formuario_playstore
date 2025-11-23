import { NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"

// GET /api/leads
// Lista todos os e-mails cadastrados (usado no painel admin)
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
      { status: 500 },
    )
  }
}

// POST /api/leads
// Salva o e-mail enviado pelo formulário
export async function POST(request: Request) {
  try {
    const body = (await request.json()) as { email?: string }
    const email = body.email?.trim()

    if (!email) {
      return NextResponse.json(
        { error: "E-mail é obrigatório." },
        { status: 400 },
      )
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(email)) {
      return NextResponse.json(
        { error: "Informe um e-mail válido." },
        { status: 400 },
      )
    }

    // upsert para não duplicar e manter o approved se já existir
    const lead = await prisma.emailLead.upsert({
      where: { email },
      update: {}, // mantém o approved atual
      create: { email }, // approved = false por padrão no schema
    })

    return NextResponse.json(
      {
        message: "E-mail registrado com sucesso.",
        leadId: lead.id,
        approved: lead.approved,
      },
      { status: 201 },
    )
  } catch (error) {
    console.error("ERRO NA ROTA POST /api/leads:", error)
    return NextResponse.json(
      { error: "Erro interno ao salvar o e-mail." },
      { status: 500 },
    )
  }
}
