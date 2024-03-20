import { NextRequest, NextResponse } from "next/server";
import { z } from 'zod'
import prisma from "../../../../../prisma/client";
import { getUserByEmail } from "@/data/user";
import { signIn } from '@/auth'
import bcrypt from 'bcryptjs'
import { RegisterSchema } from "@/schemas";

export async function POST(request: NextRequest) {
  const body = await request.json()
  const validation = RegisterSchema.safeParse(body)
  if (!validation.success)
    return NextResponse.json(validation.error.format(), { status: 400 })

  const { email, password, name } = validation.data;
  const hashedPassword = await bcrypt.hash(password, 10);

  const existingUser = await getUserByEmail(email);

  if (existingUser) {
    return NextResponse.json({ error: "Email already in use!" }, { status: 400 })
  }

  const newUser = await prisma.user.create({
    data: { name: name, email: email, password: hashedPassword }
  })
  return NextResponse.json(newUser, { status: 201 })
}