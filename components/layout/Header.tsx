"use client"

import { signOut, useSession } from "next-auth/react"
import Link from "next/link"

export function Header() {
  const { data: session } = useSession()

  return (
    <header className="bg-white shadow">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16 items-center">
          <Link href="/" className="text-xl font-bold text-gray-900">
            Todo App
          </Link>
          {session?.user && (
            <div className="flex items-center gap-4">
              <Link
                href="/profile"
                className="text-gray-700 hover:text-gray-900"
              >
                Profile
              </Link>
              <button
                onClick={() => signOut()}
                className="text-red-600 hover:text-red-700"
              >
                Sign out
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  )
}
