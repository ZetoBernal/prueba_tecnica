/** @type {import('ts-jest').JestConfigWithTsJest} */
module.exports = {
  preset: "ts-jest",
  testEnvironment: "node",
  rootDir: "src",
  testMatch: ["**/test/**/*.spec.ts"],
  collectCoverageFrom: [
    "**/*.ts",
    "!**/*.spec.ts",
    "!server.ts",
    "!app.ts",
    "!config/data-source.ts",
    "!types/**",
    "!routes/**",
    "!middlewares/rateLimiter.ts",
  ],
  coverageDirectory: "<rootDir>/../coverage",
  coverageThreshold: {
    global: {
      branches: 80,
      functions: 80,
      lines: 80,
      statements: 80,
    },
  },
};
