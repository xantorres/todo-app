import { db } from "@/lib/db"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { NextResponse } from "next/server"

export async function PATCH(
  req: Request,
  { params }: { params: { taskId: string } }
) {
  const session = await getServerSession(authOptions)
  if (!session?.user?.id) {
    return new NextResponse("Unauthorized", { status: 401 })
  }

  const { completed } = await req.json()
  const task = await db.task.update({
    where: {
      id: params.taskId,
      userId: session.user.id,
    },
    data: {
      completed,
    },
  })

  return NextResponse.json(task)
}

export async function DELETE(
  _req: Request,
  { params }: { params: { taskId: string } }
) {
  const session = await getServerSession(authOptions)
  if (!session?.user?.id) {
    return new NextResponse("Unauthorized", { status: 401 })
  }

  await db.task.delete({
    where: {
      id: params.taskId,
      userId: session.user.id,
    },
  })

  return new NextResponse(null, { status: 204 })
}
