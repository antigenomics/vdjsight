const fs = require("fs");
const env = require('dotenv');

env.config();

const schematics = [
    { name: 'FRONTEND_BUILD_MODE',                     default: 'production' },
    { name: 'FRONTEND_LOGGER_DEBUG',                   default: 'empty'      },
    { name: 'FRONTEND_REVISION',                       default: 'empty'      },
    { name: 'FRONTEND_BACKEND_API_PROTOCOL',           default: 'auto'       },
    { name: 'FRONTEND_BACKEND_API_HOST',               default: 'auto'       },
    { name: 'FRONTEND_BACKEND_API_PREFIX',             default: ''           },
    { name: 'FRONTEND_BACKEND_API_SUFFIX',             default: '/api'       },
    { name: 'FRONTEND_BACKEND_RATE_LIMIT_TIMEOUT',     default: '250'        },
    { name: 'FRONTEND_BACKEND_RATE_LIMIT_COUNT',       default: '25'         },
    { name: 'FRONTEND_BACKEND_REQUEST_RETRY_COUNT',    default: '3'          },
    { name: 'CIRCLE_SHA1',                             default: 'empty'      },
    { name: 'CIRCLE_BRANCH',                           default: 'empty'      },
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
    loggerDebug: ${ environment['FRONTEND_LOGGER_DEBUG'] !== 'empty' ? environment['FRONTEND_LOGGER_DEBUG'] === 'true' : environment['CIRCLE_BRANCH'] === 'develop' },
    backend: {
        protocol: '${ environment['FRONTEND_BACKEND_API_PROTOCOL'] }',
        host:     '${ environment['FRONTEND_BACKEND_API_HOST']     }',
        prefix:   '${ environment['FRONTEND_BACKEND_API_PREFIX']   }',
        suffix:   '${ environment['FRONTEND_BACKEND_API_SUFFIX']   }',
        limits:   {
            timeout: ${ environment['FRONTEND_BACKEND_RATE_LIMIT_TIMEOUT']  },
            count:   ${ environment['FRONTEND_BACKEND_RATE_LIMIT_COUNT']    },
            retry:   ${ environment['FRONTEND_BACKEND_REQUEST_RETRY_COUNT'] }
        }   
    },
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
