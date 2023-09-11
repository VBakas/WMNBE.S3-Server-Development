// Import the 'path' module, which is used for working with file paths.
const path = require("path");

// Export the directory name of the main module's filename.
// This code assumes that 'process.mainModule.filename' points to the main entry point file.
module.exports = path.dirname(process.mainModule.filename);
