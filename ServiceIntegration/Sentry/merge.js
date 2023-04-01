const fs = require('fs');

const file1 = fs.readFileSync('comment.js', 'utf-8');
const file2 = fs.readFileSync('./dist/FSDK_SentryIntegration.js', 'utf-8');

const mergedContent = file1 + file2;

fs.writeFileSync('./cooked/FSDK_SentryIntegration.js', mergedContent);