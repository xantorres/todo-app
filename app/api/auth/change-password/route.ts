import { db } from "@/lib/db"
import { getServerSession } from "next-auth"
import { config } from "../[...nextauth]/route"
import { NextResponse } from "next/server"
import bcrypt from "bcryptjs"

export async function POST(req: Request) {
  try {
    const session = await getServerSession(config)
    if (!session?.user?.email) {
      return new NextResponse("Unauthorized", { status: 401 })
    }

    const { currentPassword, newPassword } = await req.json()

    const user = await db.user.findUnique({
      where: { email: session.user.email },
    })

    if (!user || !user.password) {
      return new NextResponse("User not found", { status: 404 })
    }

    const isValid = await bcrypt.compare(currentPassword, user.password)
    if (!isValid) {
      return new NextResponse("Invalid current password", { status: 400 })
    }

    const hashedPassword = await bcrypt.hash(newPassword, 10)
    await db.user.update({
      where: { email: session.user.email },
      data: { password: hashedPassword },
    })

    return new NextResponse("Password updated successfully", { status: 200 })
  } catch (error) {
    return new NextResponse("Error changing password", { status: 500 })
  }
}
