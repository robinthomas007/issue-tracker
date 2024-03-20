import { NextRequest, NextResponse } from "next/server";
import { z } from 'zod'
import prisma from "../../../../../../../../prisma/client";

import { updateIssueStatus } from '@/schemas'

export async function PATCH(request: NextRequest, { params }: { params: { issueId: string } }) {
    const body = await request.json()
    const validation = updateIssueStatus.safeParse(body)
    if (!validation.success)
        return NextResponse.json(validation.error.errors, { status: 400 })

    const updatedIssue = await prisma.issue.update({
        where: { id: Number(params.issueId) },
        data: { status: body.status }
    })
    return NextResponse.json(updatedIssue, { status: 200 })
}