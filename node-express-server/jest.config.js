module.exports = {
  testEnvironment: "node",
  setupFiles: ["<rootDir>/tests/setup-env.js"],
  collectCoverageFrom: ["app.js", "app/**/*.js"],
  coverageReporters: ["lcov", "text", "json-summary"],
  coverageThreshold: {
    global: {
      lines: 70,
      statements: 70,
      functions: 70,
      branches: 60,
    },
  },
};
