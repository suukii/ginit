const path = require('path');
const fs = require('fs');

function getCurrentDirecotryBase() {
    return path.basename(process.cwd());
}

function directoryExists(filePath) {
    return fs.existsSync(filePath);
}

module.exports = {
    getCurrentDirecotryBase,
    directoryExists,
};
