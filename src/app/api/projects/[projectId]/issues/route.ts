import { NextRequest, NextResponse } from "next/server";
import { z } from 'zod'
import prisma from "../../../../../../prisma/client";
import IssueSchemaData from '@prisma/client'
import { createAttachment } from '@/actions/upload'
import { getUserByEmail } from "@/data/user";
import { addUserToProjects } from '@/actions/projects'

import { createIssueSchema } from '@/schemas'

export async function POST(request: NextRequest, params: { params: { projectId: string } }) {
  const projectId = Number(params.params.projectId);
  const body = await request.json()
  const validation = createIssueSchema.safeParse(body)
  if (!validation.success)
    return NextResponse.json(validation.error.format(), { status: 400 })

  const reporter = await getUserByEmail(body.reporter);
  if (!reporter) {
    return NextResponse.json({ error: "Reporter Invalid" }, { status: 400 })
  }
  const assgnee = await getUserByEmail(body.assignee);
  if (!assgnee) {
    return NextResponse.json({ error: "Assgnee Invalid" }, { status: 400 })
  }

  const newIssue = await prisma.issue.create({
    data: {
      title: body.title,
      description: body.description,
      projectId: projectId,
      reporterId: reporter.id,
      assigneeId: assgnee.id,
      priority: body.priority,
      type: body.type
    }
  })

  addUserToProjects([assgnee?.email!, reporter?.email!], projectId)

  if (newIssue && body.imageUrls.length > 0) {
    await createAttachment(body.imageUrls, newIssue.id)
  }

  return NextResponse.json(newIssue, { status: 201 })
}

export async function GET(request: NextRequest, params: { params: { projectId: string } }) {

  const projectId = Number(params.params.projectId);

  const project = await prisma.project.findUnique({
    where: { id: projectId },
    include: {
      users: true,
      issues: {
        orderBy: { createdAt: 'asc' },
        include: {
          Comment: {
            include: {
              Attachment: true,
              User: {
                select: {
                  email: true,
                  name: true,
                  image: true,
                }
              }
            }
          },
          Attachment: {
            where: { commentId: null }
          },
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