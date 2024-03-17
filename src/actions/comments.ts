"use server";

import prisma from "../../prisma/client";
import { updateAttachmentMultiple } from '@/actions/upload'

export const createComment = async (value: string, commentedById: string, issueId: number, imageUrls: Array<string>) => {
  try {
    const newComment = await prisma.comment.create({
      data: { comments: value, commentedById: commentedById, issueId: issueId }
    })
    console.log(newComment, "newCommentnewCommentnewCommentnewComment")
    if (newComment && imageUrls.length > 0) {
      const updatedAttachment = await updateAttachmentMultiple(imageUrls, newComment.issueId, newComment.id)
      console.log(updatedAttachment, "updatedAttachmentupdatedAttachmentupdatedAttachment")
    }

    return { data: newComment, success: "Comment added successful" }
  } catch (error) {
    return { error: error, message: "Error" }

  }

}