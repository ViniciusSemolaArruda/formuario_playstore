import { NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"

type RouteContext = {
  params: Promise<{ id: string }>
}

// GET /api/leads/[id]
// Retorna um lead específico (usado pelo front pra checar se já foi aprovado)
export async function GET(_req: Request, context: RouteContext) {
  try {
    const { id } = await context.params

    if (!id) {
      return NextResponse.json(
        { error: "Parâmetro 'id' é obrigatório." },
        { status: 400 },
      )
    }

    const lead = await prisma.emailLead.findUnique({
      where: { id },
    })

    if (!lead) {
      return NextResponse.json(
        { error: "Registro não encontrado." },
        { status: 404 },
      )
    }

    return NextResponse.json({ lead })
  } catch (error) {
    console.error("ERRO NA ROTA GET /api/leads/[id]:", error)
    return NextResponse.json(
      { error: "Erro ao buscar registro." },
      { status: 500 },
    )
  }
}

// PATCH /api/leads/[id]
// Atualiza o campo "approved" para true/false (usado no painel admin)
export async function PATCH(req: Request, context: RouteContext) {
  try {
    const { id } = await context.params

    if (!id) {
      return NextResponse.json(
        { error: "Parâmetro 'id' é obrigatório." },
        { status: 400 },
      )
    }

    const body = (await req.json().catch(() => ({}))) as {
      approved?: boolean
    }

    if (typeof body.approved !== "boolean") {
      return NextResponse.json(
        { error: "Campo 'approved' é obrigatório e deve ser boolean." },
        { status: 400 },
      )
    }

    const lead = await prisma.emailLead.update({
      where: { id },
      data: { approved: body.approved },
    })

    return NextResponse.json({ lead })
  } catch (error) {
    console.error("ERRO NA ROTA PATCH /api/leads/[id]:", error)
    return NextResponse.json(
      { error: "Erro ao atualizar registro." },
      { status: 500 },
    )
  }
}
