"use server";

import * as z from "zod";
import { AuthError } from "next-auth";

import { getUserListByEmail } from "@/data/user";

export const userListByEmail = async (email: string) => {
  const userList = await getUserListByEmail(email);
  return { data: userList, success: "userlist" }
};

