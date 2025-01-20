import { RegisterForm } from "@/components/auth/RegisterForm"
import { getServerSession } from "next-auth"
import { redirect } from "next/navigation"
import { authOptions } from "@/lib/auth"

export default async function RegisterPage() {
  const session = await getServerSession(authOptions)

  if (session) {
    redirect("/")
  }

  return (
    <main className="flex items-center justify-center min-h-screen px-4 py-12 bg-gray-50 sm:px-6 lg:px-8">
      <div className="w-full max-w-md space-y-8">
        <div>
          <h2 className="text-3xl font-bold tracking-tight text-center text-gray-900">
            Create your account
          </h2>
        </div>
        <RegisterForm />
      </div>
    </main>
  )
}
