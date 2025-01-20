"use client"

import { deleteTask, toggleTask, updateTask } from "@/app/actions/tasks"
import type { Task } from "@/types/task"
import { useState, useTransition, useRef, useEffect } from "react"

export function TaskItem({
  task,
  onDelete,
}: {
  task: Task
  onDelete: (id: string) => void
}) {
  const [isCompleted, setCompleted] = useState(task.completed)
  const [isDeleting, startDeleting] = useTransition()
  const [isUpdating, startUpdating] = useTransition()
  const [isEditing, setIsEditing] = useState(false)
  const [editedTitle, setEditedTitle] = useState(task.title)
  const inputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    if (isEditing && inputRef.current) {
      inputRef.current.focus()
    }
  }, [isEditing])

  async function onToggle() {
    if (isUpdating) return
    const newState = !isCompleted
    setCompleted(newState)

    startUpdating(async () => {
      try {
        const result = await toggleTask(task.id, newState)
        if (!result.success) {
          setCompleted(!newState) // rollback
        }
      } catch {
        setCompleted(!newState) // rollback on error
      }
    })
  }

  async function handleDelete() {
    if (isDeleting) return
    startDeleting(async () => {
      try {
        const result = await deleteTask(task.id)
        if (result.success) {
          onDelete(task.id)
        }
      } catch (error) {
        console.error("Failed to delete task")
      }
    })
  }

  async function handleUpdate() {
    if (isUpdating || editedTitle.trim() === task.title) {
      setIsEditing(false)
      setEditedTitle(task.title)
      return
    }

    const newTitle = editedTitle.trim()
    if (!newTitle) {
      setIsEditing(false)
      setEditedTitle(task.title)
      return
    }

    startUpdating(async () => {
      try {
        const result = await updateTask(task.id, { title: newTitle })
        if (!result.success) {
          setEditedTitle(task.title) // rollback
        }
      } catch {
        setEditedTitle(task.title) // rollback on error
      } finally {
        setIsEditing(false)
      }
    })
  }

  function handleKeyDown(e: React.KeyboardEvent) {
    if (e.key === "Enter") {
      if (isEditing) {
        handleUpdate()
      } else {
        !isCompleted && setIsEditing(true)
      }
    } else if (e.key === "Escape" && isEditing) {
      setIsEditing(false)
      setEditedTitle(task.title)
    }
  }

  return (
    <div
      data-testid="task-item"
      className={`flex w-full items-center justify-between p-4 rounded-lg shadow-sm hover:shadow-md transition-all duration-200 ${
        isCompleted
          ? "bg-gray-300 hover:bg-gray-200"
          : "bg-white hover:bg-blue-50/80"
      } ${isUpdating ? "opacity-50" : ""}`}
    >
      <div className="flex items-center flex-1 min-w-0 gap-3">
        <input
          type="checkbox"
          checked={isCompleted}
          onChange={onToggle}
          disabled={isUpdating}
          title={`Mark task "${editedTitle}" as ${isCompleted ? 'incomplete' : 'complete'}`}
          className="flex-shrink-0 w-4 h-4 text-blue-600 transition-colors duration-200 border-gray-300 rounded cursor-pointer focus:ring-blue-500 disabled:opacity-50"
          aria-label={`Mark task "${editedTitle}" as ${isCompleted ? 'incomplete' : 'complete'}`}
        />
        {isEditing ? (
          <input
            ref={inputRef}
            type="text"
            value={editedTitle}
            onChange={(e) => setEditedTitle(e.target.value)}
            onBlur={handleUpdate}
            onKeyDown={handleKeyDown}
            className="flex-1 min-w-0 px-1 py-0.5 text-gray-900 bg-white border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        ) : (
          <button
            onClick={() => setIsEditing(true)}
            onKeyDown={handleKeyDown}
            type="button"
            className={`text-left transition-colors duration-200 flex-1 min-w-0 truncate hover:text-blue-600 ${
              isCompleted ? "text-gray-500 line-through" : "text-gray-900"
            }`}
            title={editedTitle}
          >
            {editedTitle}
          </button>
        )}
      </div>
      <button
        onClick={handleDelete}
        type="button"
        disabled={isDeleting}
        className={`px-2 py-1 text-gray-500 transition-all duration-200 rounded-md hover:text-red-600 hover:font-medium focus:outline-none focus:ring-2 focus:ring-red-500 disabled:opacity-50 disabled:cursor-not-allowed flex-shrink-0 ${
          isDeleting ? "opacity-50" : ""
        }`}
        aria-label={`Delete task "${editedTitle}"`}
      >
        {isDeleting ? "Deleting..." : "Delete"}
      </button>
    </div>
  )
}
