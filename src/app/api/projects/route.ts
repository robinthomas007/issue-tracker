import { NextRequest, NextResponse } from "next/server";
import { z } from 'zod'
import prisma from "../../../../prisma/client";
import { auth } from '@/auth'

const createProjectSchemaValidation = z.object({
  name: z.string().min(1).max(255),
  description: z.string().min(1)
})

export async function POST(request: NextRequest) {
  const body = await request.json()
  const validation = createProjectSchemaValidation.safeParse(body)
  if (!validation.success)
    return NextResponse.json(validation.error.format(), { status: 400 })

  const session = await auth()

  const assignedUsers = await prisma.user.findMany({
    where: { email: { in: body.users, not: null } }
  })

  const newProject = await prisma.project.create({
    data: {
      name: body.name, description: body.description, createdById: session?.user.id, users: {
        connect: assignedUsers.map(user => ({ id: user.id }))
      }
    }
  })

  return NextResponse.json(newProject, { status: 201 })
}

export async function GET(request: NextRequest) {
  const session = await auth()
  if (!session || !session.user || !session.user.email) {
    return NextResponse.json({ message: 'User not authenticated' }, { status: 401 })
  }
  try {
    const projects = await prisma.project.findMany({
      where: {
        users: {
          some: { email: session.user.email }
        }
      },
      include: {
        users: true,
      }
    })
    return NextResponse.json(projects, { status: 200 })
  } catch (error) {
    return NextResponse.json({ message: 'Something went wrong' }, { status: 401 })
  }
}