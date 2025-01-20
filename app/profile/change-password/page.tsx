import { getServerSession } from "next-auth"
import { redirect } from "next/navigation"
import { authOptions } from "@/lib/auth"
import { ChangePasswordForm } from "@/components/auth/ChangePasswordForm"

export default async function ChangePasswordPage() {
  const session = await getServerSession(authOptions)

  if (!session) {
    redirect("/login")
  }

  return (
    <main className="container px-4 py-8 mx-auto">
      <div className="max-w-2xl mx-auto">
        <h1 className="mb-8 text-3xl font-bold text-white">Change Password</h1>
        <div className="p-6 bg-white rounded-lg shadow">
          <ChangePasswordForm />
        </div>
      </div>
    </main>
  )
}
