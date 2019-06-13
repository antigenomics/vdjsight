const fs = require('fs');

/***
 * This patch for semantic@2.4.2 version only
 * New version of Autoprefixer should use .browserlistrc file instead
 * ***/
const fileToPatch = 'src/styles/semantic/tasks/config/tasks.js';
const data = fs.readFileSync(fileToPatch, 'utf8');
const patched = data.replace('browsers: [\n' +
    '        \'last 2 versions\',\n' +
    '        \'> 1%\',\n' +
    '        \'opera 12.1\',\n' +
    '        \'bb 10\',\n' +
    '        \'android 4\'\n' +
    '      ]', '');

fs.writeFileSync(fileToPatch, patched, 'utf8');


