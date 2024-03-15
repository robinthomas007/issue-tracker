import { NextRequest, NextResponse } from "next/server";
import { z } from 'zod'
import prisma from "../../../../../prisma/client";
import { message } from "antd";
const createProjectSchemaValidation = z.object({
  name: z.string().min(1).max(255),
  description: z.string().min(1)
})

export async function PATCH(request: NextRequest, { params }: { params: { projectId: string } }) {
  const body = await request.json()
  const validation = createProjectSchemaValidation.safeParse(body)
  if (!validation.success)
    return NextResponse.json(validation.error.errors, { status: 400 })

  const assignedUsers = await prisma.user.findMany({
    where: { email: { in: body.users, not: null } }
  })

  try {
    const updatedProject = await prisma.project.update({
      where: { id: Number(params.projectId) },
      data: {
        name: body.title, description: body.description, users: {
          set: assignedUsers.map(user => ({ id: user.id }))
        },
      },
      include: {
        users: true
      }
    })

    // remove if any assignee that is not a project user 
    const assigneeIds = updatedProject.users.map(user => user.id)

    await prisma.issue.updateMany({
      where: {
        projectId: Number(params.projectId), assigneeId: {
          notIn: assigneeIds
        }
      },
      data: { assigneeId: null }
    })

    return NextResponse.json(updatedProject, { status: 200 })
  } catch (error) {
    return NextResponse.json({ error: error, message: 'something went wrong' }, { status: 400 })
  }
}