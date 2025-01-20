import { db } from "@/lib/db"
import bcrypt from "bcryptjs"

async function main() {
  const password = await bcrypt.hash("password123", 10)

  const user = await db.user.create({
    data: {
      email: "test@example.com",
      password,
    },
  })

  console.log({ user })
}

main()
