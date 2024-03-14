import { NextRequest, NextResponse } from "next/server";
import { z } from 'zod'
import prisma from "../../../../../../prisma/client";
import IssueSchemaData from '@prisma/client'

const createIssueSchema = z.object({
  title: z.string().min(1).max(255),
  description: z.string().min(1),
  reporterId: z.string().min(1)
})

export async function POST(request: NextRequest, params: { params: { projectId: string } }) {
  const projectId = Number(params.params.projectId);
  const body = await request.json()
  const validation = createIssueSchema.safeParse(body)
  if (!validation.success)
    return NextResponse.json(validation.error.format(), { status: 400 })
  const newIssue = await prisma.issue.create({
    data: { title: body.title, description: body.description, projectId: projectId, reporterId: body.reporterId }
  })
  return NextResponse.json(newIssue, { status: 201 })
}

export async function GET(request: NextRequest, params: { params: { projectId: string } }) {

  const projectId = Number(params.params.projectId);

  const project = await prisma.project.findUnique({
    where: { id: projectId },
    include: {
      users: true,
      issues: {
        include: {
          assignee: {
            select: {
              email: true,
              name: true,
              image: true,
            }
          },
          reporter: {
            select: {
              email: true,
              name: true,
              image: true,
            }
          },
        }
      },
    }
  })

  return NextResponse.json(project, { status: 200 })
}