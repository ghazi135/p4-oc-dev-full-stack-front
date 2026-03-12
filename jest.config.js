module.exports = {
  preset: "jest-preset-angular",
  setupFilesAfterEnv: ["<rootDir>/setup-jest.ts"],
  testMatch: ["**/*.spec.ts"],
  moduleNameMapper: {
    "@core/(.*)": "<rootDir>/src/app/core/$1",
  },
  roots: ["<rootDir>"],
  modulePaths: ["<rootDir>"],
  moduleDirectories: ["node_modules"],

  // --- Couverture ---
  collectCoverage: true,
  coverageDirectory: "./coverage/jest",
  coverageReporters: ["html", "lcov", "text-summary"],
  collectCoverageFrom: [
    "src/app/**/*.ts",
    "!src/main.ts",
    "!src/polyfills.ts",
    "!src/environments/**",
    "!src/app/**/*.spec.ts",
  ],
  coveragePathIgnorePatterns: ["<rootDir>/node_modules/"],
  coverageThreshold: {
    global: {
      statements: 80,
      branches: 80,
      functions: 80,
      lines: 80,
    },
  },
};
