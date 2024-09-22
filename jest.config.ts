import type { Config } from "jest";

const config: Config = {
  preset: "ts-jest",
  testEnvironment: "node",
  moduleNameMapper: {
    "^@src/(.*)$": "<rootDir>/src/$1",
    "^@errors/(.*)$": "<rootDir>/src/errors/$1",
    "^@middlewares/(.*)$": "<rootDir>/src/middlewares/$1",
    "^@controllers/(.*)$": "<rootDir>/src/controllers/$1",
    "^@config/(.*)$": "<rootDir>/src/config/$1",
    "^@services/(.*)$": "<rootDir>/src/services/$1",
    "^@utils/(.*)$": "<rootDir>/src/utils/$1",
    "^@schemas/(.*)$": "<rootDir>/src/schemas/$1",
  },
  transform: {
    "^.+\\.ts?$": "ts-jest",
  },
  moduleFileExtensions: ["ts", "js"],
};

export default config;
