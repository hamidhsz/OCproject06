/*multer, a middleware for handling file uploads in Node.js. This module configures multer to store uploaded images on disk 
and generate unique filenames for each uploaded file.
*
*/
const multer = require('multer');
const MIME_TYPES = { //mapping of MIME types 
    'image/jpg': 'jpg',
    'image/jpeg': 'jpg',
    'image/png': 'png',
};

const storage = multer.diskStorage({ // files must be stored on disk
    destination:(req, file, callback) => { // destination function 
        callback(null, 'images')
    },
    filename: (req, file, callback) => { // filename function
        const name = file.originalname.split(' ').join('_')[0];
        const extension = MIME_TYPES[file.mimetype];
        callback(null, name + Date.now() + '.' + extension);
    }
});

module.exports = multer ({ storage: storage }).single('image');
