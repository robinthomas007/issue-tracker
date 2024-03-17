"use server";

import prisma from "../../prisma/client";

export const createAttachment = async (filename: string, url: string, contentType: string) => {
  try {
    const attachment = await prisma.attachment.create({
      data: { filename: filename, url: url, contentType: contentType }
    })
    return { data: attachment, success: "Upload successful" }
  } catch (error) {
    return { error: error, message: "Error" }

  }

}

export const updateAttachmentMultiple = async (imageUrls: Array<string>, issueId: number | null, commentId: number | null) => {
  try {
    const attachment = await prisma.attachment.updateMany({
      where: {
        url: {
          in: imageUrls
        }
      },
      data: { issueId: issueId, commentId: commentId }
    })
    console.log(attachment, "attachmentattachmentattachment")
    return { data: attachment, success: "Upload successful" }
  } catch (error) {
    return { error: error, message: "Error" }

  }
}

export const updateAttachment = async (url: string, issueId: number, commentId: number) => {
  try {
    const attachment = await prisma.attachment.update({
      where: { url: url },
      data: { issueId: issueId, commentId: commentId }
    })
    return { data: attachment, success: "Upload successful" }
  } catch (error) {
    return { error: error, message: "Error" }

  }
}