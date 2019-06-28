module.exports = {
    preset: "jest-preset-angular",
    setupFilesAfterEnv: ["<rootDir>/src/jest.ts"],
    moduleNameMapper: {
        "^animations/(.*)$":   "<rootDir>/src/app/animations/$1",
        "^components/(.*)$":   "<rootDir>/src/app/components/$1",
        "^directives/(.*)$":   "<rootDir>/src/app/directives/$1",
        "^guards/(.*)$":       "<rootDir>/src/app/guards/$1",
        "^models/(.*)$":       "<rootDir>/src/app/models/$1",
        "^pages/(.*)$":        "<rootDir>/src/app/pages/$1",
        "^pipes/(.*)$":        "<rootDir>/src/app/pipes/$1",
        "^services/(.*)$":     "<rootDir>/src/app/services/$1",
        "^utils/(.*)$":        "<rootDir>/src/app/utils/$1",
        "^environments/(.*)$": "<rootDir>/src/environments/$1",
    },
};
