import { NextRequest, NextResponse } from "next/server";
import { z } from 'zod'
import prisma from "../../../../prisma/client";

const createProjectSchemaValidation = z.object({
  name: z.string().min(1).max(255),
  description: z.string().min(1)
})

export async function POST(request: NextRequest) {
  const body = await request.json()
  const validation = createProjectSchemaValidation.safeParse(body)
  if (!validation.success)
    return NextResponse.json(validation.error.format(), { status: 400 })

  const assignedUsers = await prisma.user.findMany({
    where: { email: { in: body.users, not: null } }
  })

  const newProject = await prisma.project.create({
    data: {
      name: body.name, description: body.description, users: {
        connect: assignedUsers.map(user => ({ id: user.id }))
      }
    }
  })

  return NextResponse.json(newProject, { status: 201 })
}

export async function GET(request: NextRequest) {
  const projects = await prisma.project.findMany({
    include: {
      users: true,
    }
  })
  return NextResponse.json(projects, { status: 200 })
}