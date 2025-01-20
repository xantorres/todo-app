import { redirect } from "next/navigation"
import { getServerSession } from "next-auth"
import { TaskList } from "@/components/tasks/TaskList"
import { authOptions } from "@/lib/auth"
import { db } from "@/lib/db"
import { Suspense } from "react"

// Revalidate every 60 seconds
export const revalidate = 60

async function getTasks(userId: string) {
  return db.task.findMany({
    where: {
      userId,
    },
    orderBy: { createdAt: "desc" },
    select: {
      id: true,
      title: true,
      completed: true,
      userId: true,
      createdAt: true,
      updatedAt: true,
    },
  })
}

function TaskListSkeleton() {
  const skeletonItems = ['top', 'middle', 'bottom']
  return (
    <div className="w-full max-w-2xl p-4 mx-auto space-y-6">
      <div className="flex gap-2 mb-6">
        <div className="flex-1 h-12 bg-gray-200 rounded-md animate-pulse" />
        <div className="w-20 h-12 bg-gray-200 rounded-md animate-pulse" />
      </div>
      <div className="space-y-3">
        {skeletonItems.map((position) => (
          <div
            key={position}
            className="h-16 bg-gray-200 rounded-lg animate-pulse"
          />
        ))}
      </div>
    </div>
  )
}

async function TaskListContainer({ userId }: { userId: string }) {
  const tasks = await getTasks(userId)
  return <TaskList initialTasks={tasks} />
}

export default async function Home() {
  const session = await getServerSession(authOptions)

  if (!session) {
    redirect("/login")
  }

  return (
    <main className="container py-8 mx-auto">
      <Suspense fallback={<TaskListSkeleton />}>
        <TaskListContainer userId={session.user.id} />
      </Suspense>
    </main>
  )
}
