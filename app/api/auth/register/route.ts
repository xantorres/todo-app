import { db } from "@/lib/db"
import { NextResponse } from "next/server"
import bcrypt from "bcryptjs"

export async function POST(req: Request) {
  try {
    const { email, password } = await req.json()

    const exists = await db.user.findUnique({
      where: { email },
    })

    if (exists) {
      return new NextResponse("User already exists", { status: 400 })
    }

    const hashedPassword = await bcrypt.hash(password, 10)

    const user = await db.user.create({
      data: {
        email,
        password: hashedPassword,
      },
    })

    return NextResponse.json({ user: { email: user.email } })
  } catch (error) {
    console.error("Registration error:", error)
    return new NextResponse(
      `Error creating user: ${
        error instanceof Error ? error.message : "Unknown error"
      }`,
      { status: 500 }
    )
  }
}
