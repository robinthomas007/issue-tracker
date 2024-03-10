import { NextRequest, NextResponse } from "next/server";
import { z } from 'zod'
import prisma from "../../../../../../../prisma/client";

const createIssueSchema = z.object({
  title: z.string().min(1).max(255),
  description: z.string().min(1)
})

export async function PATCH(request: NextRequest, { params }: { params: { issueId: string } }) {
  const body = await request.json()
  const validation = createIssueSchema.safeParse(body)
  if (!validation.success)
    return NextResponse.json(validation.error.errors, { status: 400 })

  const updatedIssue = await prisma.issue.update({
    where: { id: Number(params.issueId) },
    data: { title: body.title, description: body.description }
  })
  return NextResponse.json(updatedIssue, { status: 200 })
}