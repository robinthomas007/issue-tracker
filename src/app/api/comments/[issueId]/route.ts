import { NextRequest, NextResponse } from "next/server";
import { z } from 'zod'
import prisma from "../../../../../prisma/client";
import IssueSchemaData from '@prisma/client'

export async function GET(request: NextRequest, params: { params: { issueId: number } }) {
  const id = Number(params.params.issueId);
  const comments = await prisma.comment.findMany({
    where: { issueId: id },
    include: {
      User: {
        select: {
          email: true,
          name: true,
          image: true,
        }
      },
      Attachment: true,
    }
  })

  return NextResponse.json(comments, { status: 200 })
}