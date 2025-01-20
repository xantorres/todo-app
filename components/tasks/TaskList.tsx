"use client"

import { addTask } from "@/app/actions/tasks"
import { useState, useTransition } from "react"
import { TaskItem } from "./TaskItem"
import type { Task } from "@/types/task"

export function TaskList({ initialTasks }: { initialTasks: Task[] }) {
  const [tasks, setTasks] = useState(initialTasks)
  const [newTask, setNewTask] = useState("")
  const [isPending, startTransition] = useTransition()

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!newTask.trim() || isPending) return

    const tempId = Date.now().toString()
    const tempTask: Task = {
      id: tempId,
      title: newTask,
      completed: false,
      userId: "",
      createdAt: new Date(),
      updatedAt: new Date(),
    }

    setNewTask("")
    setTasks((prev) => [tempTask, ...prev])

    startTransition(async () => {
      try {
        const result = await addTask(newTask)
        if (result.success && result.task) {
          // Replace temp task with real one
          setTasks((prev) => prev.map((t) => (t.id === tempId ? result.task : t)))
        } else {
          setTasks((prev) => prev.filter((t) => t.id !== tempId))
          setNewTask(newTask)
        }
      } catch {
        setTasks((prev) => prev.filter((t) => t.id !== tempId))
        setNewTask(newTask)
      }
    })
  }

  return (
    <div className="w-full max-w-2xl p-4 mx-auto">
      <form onSubmit={handleSubmit} className="flex gap-2 mb-6">
        <input
          type="text"
          value={newTask}
          onChange={(e) => setNewTask(e.target.value)}
          placeholder="Add a new task..."
          className="flex-1 px-4 py-2 text-gray-900 transition-colors duration-200 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 hover:border-blue-300"
          disabled={isPending}
        />
        <button
          type="submit"
          disabled={isPending}
          className="px-6 py-2 text-white transition-all duration-200 bg-blue-500 rounded-md shadow-sm hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 hover:shadow disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isPending ? "Adding..." : "Add"}
        </button>
      </form>
      <div className="space-y-3">
        {tasks.map((task) => (
          <TaskItem
            key={task.id}
            task={task}
            onDelete={(taskId) => {
              setTasks((prev) => prev.filter((t) => t.id !== taskId))
            }}
          />
        ))}
        {tasks.length === 0 && (
          <p className="text-center text-gray-500">No tasks yet. Add one above!</p>
        )}
      </div>
    </div>
  )
}
