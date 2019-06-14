const fs = require("fs");
const env = require('dotenv');

env.config();

const schematics = [
    { name: 'FRONTEND_BUILD_MODE',                     default: 'production' },
    { name: 'FRONTEND_REVISION',                       default: 'empty'      },
    { name: 'CIRCLE_SHA1',                             default: 'empty'      },
    { name: 'FRONTEND_CONFIGURATION_TAG',              default: 'prod' }
];

function createEnvironment(schematics) {
    const environment = {};
    schematics.forEach((entry) => {
        const value = process.env[entry.name];
        environment[entry.name] = value !== undefined ? value : entry.default;
    });
    return environment;
}

const version = JSON.parse(fs.readFileSync('package.json', { encoding: 'utf-8' }))['version'];

const environment = createEnvironment(schematics);
const environmentFileContent = `
// tslint:disable
import { ApplicationEnvironment } from 'environments/index';
export const environment: ApplicationEnvironment = {
    version:    '${ version }',
    revision:   '${ environment['FRONTEND_REVISION'] !== 'empty' ? environment['FRONTEND_REVISION'] : environment['CIRCLE_SHA1'] }',
    production:  ${ environment['FRONTEND_BUILD_MODE'] === 'production' },
};
`;

const environmentFileTargetPath = `./src/environments/environment.${ environment['FRONTEND_CONFIGURATION_TAG'] }.ts`;

fs.writeFile(environmentFileTargetPath, environmentFileContent, (error) => {
    if (error) {
        console.error('Environment generation error: ', error);
    } else {
        console.log(`Environment generated at ${environmentFileTargetPath}`);
    }
});
