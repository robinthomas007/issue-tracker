"use server";

import prisma from "../../prisma/client";
import { createAttachment } from '@/actions/upload'

export const createComment = async (value: string, commentedById: string, issueId: number, imageUrls: Array<string>) => {
  try {
    const newComment = await prisma.comment.create({
      data: { comments: value, commentedById: commentedById, issueId: issueId }
    })

    console.log(newComment, imageUrls)

    if (newComment && imageUrls.length > 0) {
      const newAttachment = await createAttachment(imageUrls, newComment.issueId, newComment.id)
      console.log(newAttachment)
    }

    return { data: newComment, success: "Comment added successful" }
  } catch (error) {
    return { error: error, message: "Error" }

  }

}