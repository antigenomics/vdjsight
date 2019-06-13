const path = require('path');
const fs = require('fs');
const purifycss = require('purify-css');

function fromDir(startPath, filter, callback) {

    if (!fs.existsSync(startPath)) {
        console.log('no dir ', startPath);
        return;
    }

    const files = fs.readdirSync(startPath);
    for (let i = 0; i < files.length; i++) {
        const filename = path.join(startPath, files[i]);
        const stat = fs.lstatSync(filename);
        if (stat.isDirectory()) {
            fromDir(filename, filter, callback); // recurse
        } else if (filter.test(filename)) {
            callback(filename);
        }
    }
}

fromDir('./dist', /\.css/, function (filename) {
    const content = ['./dist/*.js', './dist/*.html'];
    const css = [filename];

    const options = {
        output: filename,
        minify: true,
        info: true,
    };

    console.log('-- found: ', filename);
    purifycss(content, css, options);
});
