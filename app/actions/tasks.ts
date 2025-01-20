"use server"

import { db } from "@/lib/db"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import type { Task } from "@/types/task"

export async function toggleTask(id: string, completed: boolean) {
  await db.task.update({
    where: { id },
    data: { completed },
  })
  return { success: true }
}

export async function deleteTask(id: string) {
  await db.task.delete({
    where: { id },
  })
  return { success: true }
}

export async function addTask(title: string) {
  const session = await getServerSession(authOptions)
  if (!session?.user?.id) throw new Error("Unauthorized")

  const task = await db.task.create({
    data: {
      title,
      userId: session.user.id,
    },
  })

  return { success: true, task }
}

export async function updateTask(
  id: string,
  data: { title?: string; completed?: boolean }
): Promise<{ success: boolean; task?: Task }> {
  try {
    const task = await db.task.update({
      where: { id },
      data,
    })
    return { success: true, task }
  } catch (error) {
    console.error("Failed to update task:", error)
    return { success: false }
  }
}
