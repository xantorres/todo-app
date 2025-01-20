const nextJest = require("next/jest")

const createJestConfig = nextJest({
  dir: "./",
})

const customJestConfig = {
  setupFilesAfterEnv: ["<rootDir>/jest.setup.js"],
  testEnvironment: "jest-environment-jsdom",
  moduleNameMapper: {
    "^@/(.*)$": "<rootDir>/$1",
  },
  transformIgnorePatterns: [
    "node_modules/(?!(next|next/dist/lib|jose|@panva|oidc-token-hash|openid-client|next-auth|@babel/runtime)/)",
  ],
}

module.exports = createJestConfig(customJestConfig)
