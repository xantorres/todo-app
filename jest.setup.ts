/// <reference types="jest" />
import "@testing-library/jest-dom"

// Mock fetch globally
const mockFetch = jest.fn()
global.fetch = mockFetch

// Mock Response globally
const mockResponse = jest.fn() as unknown as typeof Response
global.Response = mockResponse
