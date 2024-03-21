"use server";

import { error } from "console";
import prisma from "../../prisma/client";

import { getUserByEmail } from "@/data/user";
import { addUserToProjects } from '@/actions/projects'
import { deleteFileFromS3 } from '@/actions/s3'

export const assignIssue = async (email: string, issueId: number, projectId: number) => {

  const user = await getUserByEmail(email);

  if (!user) {
    // send invitation to the user
    return { error: "user not found" }
  }

  try {
    const projects = await prisma.project.findMany({
      where: {
        id: projectId, users: {
          some: { email: email }
        }
      }
    })

    if (projects.length === 0) {
      addUserToProjects([email], projectId)
    }
    const updatedIssue = await prisma.issue.update({
      where: { id: Number(issueId) },
      data: { assigneeId: user.id }
    })

    return { data: updatedIssue, success: "Issue has been assigned!" }

  } catch (error) {
    return { error: error, message: "something went worng" }

  }
};

export const ReporterIssue = async (email: string, issueId: number, projectId: number) => {

  const user = await getUserByEmail(email);

  if (!user) {
    return { error: "user not found" }
  }

  try {
    const projects = await prisma.project.findMany({
      where: {
        users: {
          some: { email: email }
        }
      }
    })

    if (projects.length === 0) {
      addUserToProjects([email], projectId)
    }

    const updatedIssue = await prisma.issue.update({
      where: { id: Number(issueId) },
      data: { reporterId: user.id }
    })

    return { data: updatedIssue, success: "Issue reporter added!" }
  } catch (error) {
    return { error: error, message: "something went worng" }
  }

};


export const deleteIssueApi = async (issueId: number) => {
  try {

    const attachmentsToDelete = await prisma.attachment.findMany({
      where: { issueId: issueId }
    });

    attachmentsToDelete.map(async (attachment) => {
      const key = attachment?.url.split("/").pop();
      await deleteFileFromS3(key!);
    });

    await prisma.attachment.deleteMany({
      where: { issueId: issueId }
    });

    await prisma.comment.deleteMany({
      where: { issueId: issueId }
    });

    const deletedIssue = await prisma.issue.delete({
      where: { id: issueId }
    });

    return { data: deletedIssue, success: "Issue deleted successfully" };
  } catch (error) {
    return { error: error, message: "Error deleting issue" };
  }
}