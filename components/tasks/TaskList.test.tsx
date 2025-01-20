import { render, screen, fireEvent, waitFor } from "@testing-library/react"
import { TaskList } from "./TaskList"
import { addTask } from "@/app/actions/tasks"

// Mock the server action
jest.mock("@/app/actions/tasks", () => ({
  addTask: jest.fn(),
}))

describe("TaskList", () => {
  const mockTasks = [
    {
      id: "1",
      title: "Task 1",
      completed: false,
      userId: "user1",
      createdAt: new Date(),
      updatedAt: new Date(),
    },
    {
      id: "2",
      title: "Task 2",
      completed: true,
      userId: "user1",
      createdAt: new Date(),
      updatedAt: new Date(),
    },
  ]

  beforeEach(() => {
    jest.clearAllMocks()
    // Mock successful task creation
    ;(addTask as jest.Mock).mockResolvedValue({
      success: true,
      task: {
        id: "3",
        title: "New Task",
        completed: false,
        userId: "user1",
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    })
  })

  it("renders task list", () => {
    render(<TaskList initialTasks={mockTasks} />)
    expect(screen.getByText("Task 1")).toBeInTheDocument()
    expect(screen.getByText("Task 2")).toBeInTheDocument()
  })

  it("adds new task", async () => {
    render(<TaskList initialTasks={mockTasks} />)
    const input = screen.getByPlaceholderText("Add a new task...")

    fireEvent.change(input, { target: { value: "New Task" } })
    fireEvent.submit(input.closest("form")!)

    await waitFor(() => {
      expect(screen.getByText("New Task")).toBeInTheDocument()
    })
    expect(addTask).toHaveBeenCalledWith("New Task")
  })
})
