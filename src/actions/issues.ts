"use server";

import { error } from "console";
import prisma from "../../prisma/client";

import { getUserByEmail } from "@/data/user";

export const assignIssue = async (email: string, issueId: number) => {

  const user = await getUserByEmail(email);

  if (!user) {
    // send invitation to the user
    return { error: "user not found" }
  }

  try {
    const updatedIssue = await prisma.issue.update({
      where: { id: Number(issueId) },
      data: { assigneeId: user.id }
    })

    return { data: updatedIssue, success: "Issue has been assigned!" }
  } catch (error) {
    return { error: error, message: "something went worng" }
  }

};

export const ReporterIssue = async (email: string, issueId: number) => {

  const user = await getUserByEmail(email);

  if (!user) {
    return { error: "user not found" }
  }

  try {
    const updatedIssue = await prisma.issue.update({
      where: { id: Number(issueId) },
      data: { reporterId: user.id }
    })

    return { data: updatedIssue, success: "Issue reporter added!" }
  } catch (error) {
    return { error: error, message: "something went worng" }
  }

};

