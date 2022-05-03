// scripts/rm.js
const fs = require('fs-extra');
const path = require('path');
// remove unnecessary file
const dirs = fs.readdirSync(path.join(__dirname, '../es'));
dirs.forEach((item) => {
    if (item.includes('app.') || item.includes('DS_Store') || item.includes('demo') || item.includes('test') || item.endsWith('ts')) {
        fs.removeSync(path.join(__dirname, '../es/', item));
    } else {
        if(item.isDirectory) {
            const moduleDirs = fs.readdirSync(path.join(__dirname, '../es/', item));
            moduleDirs.forEach((item2) => {
                if (item2.includes('demo')) {
                    fs.removeSync(path.join(__dirname, '../es/', item, item2));
                }
            });
        }
    }
});
fs.removeSync(path.join(__dirname, '../lib/'));