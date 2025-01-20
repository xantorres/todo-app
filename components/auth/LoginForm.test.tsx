import { render, screen, fireEvent, act } from "@testing-library/react"
import { LoginForm } from "./LoginForm"
import { signIn } from "next-auth/react"
import { useRouter } from "next/navigation"
import { SessionProvider } from "next-auth/react"

// Mock next-auth
jest.mock("next-auth/react", () => ({
  signIn: jest.fn(),
  SessionProvider: ({ children }: { children: React.ReactNode }) => children,
}))

// Mock next/navigation
jest.mock("next/navigation", () => ({
  useRouter: jest.fn(),
}))

// Create a wrapper component with providers
const renderWithProviders = (ui: React.ReactElement) => {
  return render(<SessionProvider>{ui}</SessionProvider>)
}

describe("LoginForm", () => {
  const mockRouter = {
    push: jest.fn(),
    refresh: jest.fn(),
  }

  beforeEach(() => {
    jest.clearAllMocks()
    ;(useRouter as jest.Mock).mockReturnValue(mockRouter)
  })

  it("renders login form", () => {
    renderWithProviders(<LoginForm />)
    expect(screen.getByLabelText(/email/i)).toBeInTheDocument()
    expect(screen.getByLabelText(/password/i)).toBeInTheDocument()
    expect(screen.getByRole("button", { name: /sign in/i })).toBeInTheDocument()
  })

  it("handles successful login", async () => {
    ;(signIn as jest.Mock).mockResolvedValueOnce({ error: null })

    render(
      <SessionProvider>
        <LoginForm />
      </SessionProvider>
    )

    await act(async () => {
      await fireEvent.change(screen.getByLabelText(/email/i), {
        target: { value: "test@example.com" },
      })
      await fireEvent.change(screen.getByLabelText(/password/i), {
        target: { value: "password123" },
      })
      await fireEvent.submit(screen.getByRole("button", { name: /sign in/i }))
    })

    expect(signIn).toHaveBeenCalledWith("credentials", {
      email: "test@example.com",
      password: "password123",
      redirect: false,
    })
    expect(mockRouter.push).toHaveBeenCalledWith("/")
  })

  it("shows error message on failed login", async () => {
    ;(signIn as jest.Mock).mockResolvedValueOnce({
      error: "Invalid credentials",
    })

    render(
      <SessionProvider>
        <LoginForm />
      </SessionProvider>
    )

    await act(async () => {
      await fireEvent.submit(screen.getByRole("button", { name: /sign in/i }))
    })

    const errorMessage = await screen.findByTestId("error-message")
    expect(errorMessage).toHaveTextContent("Invalid credentials")
  })
})
