const fs = require('fs');
const path = require('path');

function readFilesAndCombine(directory, outputFile) {
    const files = fs.readdirSync(directory);

    files.forEach((file) => {
        const filePath = path.join(directory, file);
        const stat = fs.statSync(filePath);

        if (stat.isDirectory()) {
            readFilesAndCombine(filePath, outputFile);
        } else if (/\.(ts|html|css)$/.test(file)) {
            const content = fs.readFileSync(filePath, 'utf8');
            fs.appendFileSync(outputFile, `\n\n// File: ${filePath}\n${content}`);
        }
    });
}

readFilesAndCombine('./src', 'angular_app_code.txt');
console.log('Angular app code has been combined into angular_app_code.txt');
