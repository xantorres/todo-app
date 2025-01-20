import { render, screen, fireEvent, waitFor } from "@testing-library/react"
import { TaskItem } from "./TaskItem"
import { deleteTask, toggleTask } from "@/app/actions/tasks"

// Mock the server actions
jest.mock("@/app/actions/tasks", () => ({
  deleteTask: jest.fn(),
  toggleTask: jest.fn(),
}))

describe("TaskItem", () => {
  const mockTask = {
    id: "1",
    title: "Test Task",
    completed: false,
    userId: "user1",
    createdAt: new Date(),
    updatedAt: new Date(),
  }
  const mockOnDelete = jest.fn()

  beforeEach(() => {
    jest.clearAllMocks()
    ;(deleteTask as jest.Mock).mockResolvedValue({ success: true })
    ;(toggleTask as jest.Mock).mockResolvedValue({ success: true })
  })

  it("renders task title", () => {
    render(<TaskItem task={mockTask} onDelete={mockOnDelete} />)
    expect(screen.getByText("Test Task")).toBeInTheDocument()
  })

  it("shows correct checkbox state", () => {
    render(<TaskItem task={mockTask} onDelete={mockOnDelete} />)
    const checkbox = screen.getByRole("checkbox")
    expect(checkbox).not.toBeChecked()
  })

  it("calls onDelete when delete button is clicked", async () => {
    render(<TaskItem task={mockTask} onDelete={mockOnDelete} />)
    const deleteButton = screen.getByText("Delete")
    fireEvent.click(deleteButton)
    expect(deleteTask).toHaveBeenCalledWith(mockTask.id)
    await waitFor(() => {
      expect(mockOnDelete).toHaveBeenCalledWith(mockTask.id)
    })
  })

  it("toggles task completion", async () => {
    render(<TaskItem task={mockTask} onDelete={mockOnDelete} />)
    const checkbox = screen.getByRole("checkbox")
    fireEvent.click(checkbox)
    expect(toggleTask).toHaveBeenCalledWith(mockTask.id, true)
  })
})
