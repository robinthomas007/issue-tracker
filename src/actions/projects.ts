"use server";

import { error } from "console";
import prisma from "../../prisma/client";

export const addUserToProjects = async (emails: Array<string>, projectId: number) => {

  const assignedUsers = await prisma.user.findMany({
    where: { email: { in: emails, not: null } }
  })

  try {
    const updateProjectUsers = await prisma.project.update({
      where: { id: Number(projectId) },
      data: {
        users: {
          connect: assignedUsers.map(user => ({ id: user.id }))
        }
      },
    })
    return { data: updateProjectUsers, success: "User has been assigned to project!" }
  } catch (error) {
    return { error: error, message: "something went worng" }
  }
};

