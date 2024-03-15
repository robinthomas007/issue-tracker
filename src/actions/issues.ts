"use server";

import { error } from "console";
import prisma from "../../prisma/client";

import { getUserByEmail } from "@/data/user";
import { addUserToProjects } from '@/actions/projects'
export const assignIssue = async (email: string, issueId: number, projectId: number) => {

  const user = await getUserByEmail(email);

  if (!user) {
    // send invitation to the user
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

