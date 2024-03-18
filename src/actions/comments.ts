"use server";

import prisma from "../../prisma/client";
import { createAttachment } from '@/actions/upload'
import { upsertAttachment } from '@/actions/upload'
import { deleteFileFromS3 } from '@/actions/s3'

export const createComment = async (value: string, commentedById: string, issueId: number, imageUrls: Array<string>) => {
  try {
    const newComment = await prisma.comment.create({
      data: { comments: value, commentedById: commentedById, issueId: issueId }
    })

    console.log(newComment, imageUrls)

    if (newComment && imageUrls.length > 0) {
      await createAttachment(imageUrls, newComment.issueId, newComment.id)
    }

    return { data: newComment, success: "Comment added successful" }
  } catch (error) {
    return { error: error, message: "Error" }

  }

}

export const updateComment = async (commentId: number, value: string, commentedById: string, issueId: number, imageUrls: Array<string>) => {
  try {
    const updatedComment = await prisma.comment.update({
      where: { id: commentId },
      data: { comments: value, commentedById: commentedById, issueId: issueId }
    })

    if (updatedComment && imageUrls.length > 0) {
      await upsertAttachment(imageUrls, updatedComment.issueId, updatedComment.id)
    }

    return { data: updatedComment, success: "Comment updated successful" }
  } catch (error) {
    return { error: error, message: "Error" }

  }

}

export const deleteComment = async (commentId: number) => {
  try {
    const deleteComment = await prisma.comment.delete({
      where: { id: commentId },
      include: { Attachment: true }
    });

    const deleteAttachmentPromises = deleteComment.Attachment.map(async (at) => {
      const key = at?.url.split("/").pop();
      await deleteFileFromS3(key!);
    });

    await Promise.all(deleteAttachmentPromises);

    await upsertAttachment([], deleteComment.issueId, deleteComment.id);

    return { data: deleteComment, success: "Comment deleted successfully" };
  } catch (error) {
    return { error: error, message: "Error" };
  }


}

