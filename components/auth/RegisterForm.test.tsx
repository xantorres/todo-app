import { render, screen, fireEvent, waitFor } from "@testing-library/react"
import { RegisterForm } from "./RegisterForm"
import { useRouter } from "next/navigation"
import { signIn } from "next-auth/react"

// Mock next/navigation
jest.mock("next/navigation", () => ({
  useRouter: jest.fn(),
}))

// Mock next-auth/react
jest.mock("next-auth/react", () => ({
  signIn: jest.fn(),
}))

describe("RegisterForm", () => {
  const mockRouter = {
    push: jest.fn(),
    refresh: jest.fn(),
  }

  beforeEach(() => {
    jest.clearAllMocks()
    ;(useRouter as jest.Mock).mockReturnValue(mockRouter)
    // Setup fetch mock
    global.fetch = jest.fn()
    // Mock successful sign in
    ;(signIn as jest.Mock).mockResolvedValue({ error: null })
  })

  it("renders register form", () => {
    render(<RegisterForm />)
    expect(screen.getByLabelText(/email/i)).toBeInTheDocument()
    expect(screen.getByLabelText(/password/i)).toBeInTheDocument()
  })

  it("handles successful registration", async () => {
    // Mock successful registration
    ;(global.fetch as jest.Mock).mockResolvedValueOnce({
      ok: true,
      status: 201,
    })

    render(<RegisterForm />)

    fireEvent.change(screen.getByLabelText(/email/i), {
      target: { value: "test@example.com" },
    })
    fireEvent.change(screen.getByLabelText(/password/i), {
      target: { value: "password123" },
    })
    fireEvent.submit(screen.getByRole("button", { name: /create account/i }))

    await waitFor(() => {
      expect(mockRouter.push).toHaveBeenCalledWith("/")
      expect(mockRouter.refresh).toHaveBeenCalled()
      expect(signIn).toHaveBeenCalledWith("credentials", {
        email: "test@example.com",
        password: "password123",
        redirect: false,
      })
    })
  })

  it("shows error message on registration failure", async () => {
    // Mock failed registration
    ;(global.fetch as jest.Mock).mockResolvedValueOnce({
      ok: false,
      status: 400,
      text: () => Promise.resolve("Email already exists"),
    })

    render(<RegisterForm />)

    fireEvent.change(screen.getByLabelText(/email/i), {
      target: { value: "test@example.com" },
    })
    fireEvent.change(screen.getByLabelText(/password/i), {
      target: { value: "password123" },
    })
    fireEvent.submit(screen.getByRole("button", { name: /create account/i }))

    await waitFor(() => {
      expect(screen.getByTestId("error-message")).toHaveTextContent(
        "Email already exists"
      )
    })
  })

  afterEach(() => {
    jest.restoreAllMocks()
  })
})
