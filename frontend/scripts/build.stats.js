require('console.table');
require('console');

const fs = require('fs');
const path = require('path');
const glob = require('glob');
const pathToBundle = path.resolve(__dirname, '../dist/frontend');
const gzipSize = require('gzip-size');

const types = [
    { name: 'core-es2015',      test: (file) => file.includes('main-es2015') || file.includes('runtime-es2015') },
    { name: 'core-es5',         test: (file) => file.includes('main-es5') || file.includes('runtime-es5') },
    { name: 'lazy-es2015',      test: (file) =>
        {
            const prefix = file.split('.')[0].split('-');
            return !Number.isNaN(Number(prefix[0])) && prefix[1] === 'es2015';
        }
    },
    { name: 'lazy-es5',      test: (file) =>
        {
            const prefix = file.split('.')[0].split('-');
            return !Number.isNaN(Number(prefix[0])) && prefix[1] === 'es5';
        }
    },
    { name: 'styles',           test: (file) => file.endsWith('css') },
    { name: 'polyfills-es2015', test: (file) => file.includes('polyfills-es2015') },
    { name: 'polyfills-es5',    test: (file) => file.includes('polyfills-es5') },
    { name: 'unknown',          test: () => true }
];

const bundleFiles = glob.sync(pathToBundle + '/*.@(js|css)').map((file) => {
    const stats = fs.statSync(file);
    const size = (stats.size / 1024.0); //KB
    const compressed = (gzipSize.sync(fs.readFileSync(file)) / 1024.0); //KB
    const name = path.basename(file);

    const type = types.find((t) => t.test(name));
    return { name, size, compressed, type }
});

const lengthReducer = (prev, file, key) => {
    const length = String(file[key]).length;
    return prev > length ? prev : length;
};

const rowDelimiterLengths = {
    name: bundleFiles.reduce((prev, file) => lengthReducer(prev, file, 'name'), 0),
    size: bundleFiles.reduce((prev, file) => lengthReducer(prev, file, 'size'), 0),
    compressed: bundleFiles.reduce((prev, file) => lengthReducer(prev, file, 'compressed'), 0),
    type: bundleFiles.reduce((prev, file) => lengthReducer(prev, file, 'type'), 0)
};

const createFillerRow = (delimiter) => ({
    Name: ''.padStart(rowDelimiterLengths.name, delimiter),
    Size: ''.padStart(rowDelimiterLengths.size, delimiter),
    Compressed: ''.padStart(rowDelimiterLengths.compressed, delimiter),
    Type: ''.padStart(rowDelimiterLengths.type, delimiter)
});

const fillerRows = {
    empty: createFillerRow(''),
    dashed: createFillerRow('-')
};

const memorySizePrettified = (size, key) => size.toFixed(2).padStart(rowDelimiterLengths[key] - 3) + ' KB';

const rows = [];
types.forEach((type) => {
    if (type.name !== 'unknown') {
        const typeFilteredFiles = bundleFiles.filter((file) => file.type.name === type.name);
        typeFilteredFiles.sort((a, b) => a.size < b.size).forEach((file) => {
            rows.push({
                Name: file.name,
                Size: memorySizePrettified(file.size, 'size'),
                Compressed: memorySizePrettified(file.compressed, 'compressed'),
                Type: file.type.name
            })
        });
        rows.push(fillerRows.dashed);
    }
});

rows.push(fillerRows.empty);

function appendStatisticsRows(statistics) {
    statistics.forEach((statistic) => {
        const filtered = bundleFiles.filter((file) => statistic.types.includes(file.type.name));
        const size = filtered.reduce((prev, file) => prev + file.size, 0);
        const compressed = filtered.reduce((prev, file) => prev + file.compressed, 0);
        rows.push({
            'Name': statistic.name,
            'Size': memorySizePrettified(size, 'size'),
            'Compressed': memorySizePrettified(compressed, 'compressed')
        })
    });
}

const totalStatisticTypes = [
    { name: 'Application core (es2015)',  types: ['core-es2015'] },
    { name: 'Application core (es5)',     types: ['core-es5'] },
    { name: 'Lazy modules (es2015)',      types: ['lazy-es2015'] },
    { name: 'Lazy modules (es5)',         types: ['lazy-es5'] },
    { name: 'Styles',                     types: ['styles'] },
    { name: 'Polyfills (es2015)',         types: ['polyfills-es2015'] },
    { name: 'Polyfills (es5)',            types: ['polyfills-es5'] },
];

appendStatisticsRows(totalStatisticTypes);

const applicationBundleOverallStatistic = [
    { name: 'Application total (es2015)', types: ['core-es2015', 'lazy-es2015', 'styles', 'polyfills-es2015'] },
    { name: 'Application total (es5)',    types: ['core-es5', 'lazy-es5', 'styles', 'polyfills-es5'] }
];

rows.push(fillerRows.dashed);

appendStatisticsRows(applicationBundleOverallStatistic);

console.table('Frontend bundle statistic', rows);
