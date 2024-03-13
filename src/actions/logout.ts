"use server"
import { signOut } from '@/auth'

export const logout = async () => {
    // other server operations
    await signOut()
}