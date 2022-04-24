var fs = require('fs');

module.exports.createFolder = async (a) => await fs.promises.mkdir(a);

module.exports.readFolder = (a) => fs.readdirSync(a);

module.exports.deleteFile = (a) => fs.unlinkSync(a);

module.exports.deleteFolder = (a) => fs.rmSync(a, { recursive: true });

module.exports.directoryExists = (a) => fs.existsSync(a);

module.exports.ifExistsDelete = (a) => this.directoryExists(a) && this.deleteFile(a);
