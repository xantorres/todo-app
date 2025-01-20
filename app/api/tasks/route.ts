import { db } from "@/lib/db"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { NextResponse } from "next/server"

export async function GET() {
  const session = await getServerSession(authOptions)
  if (!session?.user?.id) {
    return new NextResponse("Unauthorized", { status: 401 })
  }

  const tasks = await db.task.findMany({
    where: {
      userId: session.user.id,
    },
    orderBy: {
      createdAt: "desc",
    },
  })

  return NextResponse.json(tasks)
}

export async function POST(req: Request) {
  const session = await getServerSession(authOptions)
  if (!session?.user?.id) {
    return new NextResponse("Unauthorized", { status: 401 })
  }

  const { title } = await req.json()
  if (!title) {
    return new NextResponse("Title is required", { status: 400 })
  }

  const task = await db.task.create({
    data: {
      title,
      userId: session.user.id,
    },
  })

  return NextResponse.json(task)
}
