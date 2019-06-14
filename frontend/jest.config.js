module.exports = {
    preset: "jest-preset-angular",
    setupFilesAfterEnv: ["<rootDir>/src/jest.ts"],
    moduleNameMapper: {
        "environments/(.*)": "<rootDir>/src/environments/$1",
    }
};
