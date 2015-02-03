'use strict';
/**
 * Created by thomascoquel on 02/02/15.
 * Handles file upload problematics
 */

var errorHandler = require('./errors.server.controller'),
    fs = require('fs');

var PUBLIC_FOLDER = 'public/';
var UPLOAD_BASE_FOLDER = 'public/uploads/';
var UPLOAD_BASE_RELATIVE_FOLDER = 'uploads/';
var APP_CONTROLLER_FOLDER_DEPTH = 2;

/**
 * @return the path on which to store the file on the server
 * @param uploadType
 * @param fileName
 */
var getRealPathToStoreFile = function(uploadType, fileName) {
    var uploadDir = UPLOAD_BASE_FOLDER + uploadType;
    var newDir = __dirname;
    for (var i = 0; i < APP_CONTROLLER_FOLDER_DEPTH; i++) {
        newDir += '/..';
    }
    newDir += '/';

    var dirs = uploadDir.split('/');
    for (var i = 0; i < dirs.length; i++) {
        newDir += dirs[i] + '/';
        if (!fs.exists(newDir)) {
            fs.mkdir(newDir, function(err) {
                if (err.code !== 'EEXIST') {
                    console.log(err);
                }
            })
        }
    }

    //console.log(newDir + fileName);
    return newDir + fileName;
};

var getPublicPath = function(uploadType, fileName) {
    //console.log(UPLOAD_BASE_RELATIVE_FOLDER + uploadType + '/' + fileName);
    return UPLOAD_BASE_RELATIVE_FOLDER + uploadType + '/' + fileName;
};

var addFileExtensionToFileName = function(file, fileName) {
    var nameSplit = file.name.split('.');
    return fileName + '.' + nameSplit[nameSplit.length - 1];
};

/**
 * Convert a string to a slug
 * @param str the string to convert to slug
 * @returns {string} the converted slug string
 */
exports.stringToSlug = function(str) {
    str = new String(str);
    str = str.replace(/^\s+|\s+$/g, ''); // trim
    str = str.toLowerCase();

    // remove accents, swap ñ for n, etc
    var from = "àáäâèéëêìíïîòóöôùúüûñç·/_,:;";
    var to   = "aaaaeeeeiiiioooouuuunc------";
    for (var i=0, l=from.length ; i<l ; i++) {
        str = str.replace(new RegExp(from.charAt(i), 'g'), to.charAt(i));
    }

    str = str.replace(/[^a-z0-9 -]/g, '') // remove invalid chars
        .replace(/\s+/g, '-') // collapse whitespace and replace by -
        .replace(/-+/g, '-'); // collapse dashes

    return str;
};

/**
 * Store a file on the server, in the correct upload folder
 * @param uploadType
 * @param file
 * @param fileName the desired file name, without extension
 * @param previousFilePath the previous file path
 * @param callback the callback function with args: uploadPath, err
 */
exports.storeFile = function(uploadType, file, fileName, previousFilePath, callback) {
    var realName = addFileExtensionToFileName(file, exports.stringToSlug(fileName));
    var realPath = getRealPathToStoreFile(uploadType, realName);

    fs.readFile(file.path, function (err, data) {
        fs.writeFile(realPath, data, function (err) {
            //console.log(getPublicPath(uploadType, realName));
            var uploadPath = getPublicPath(uploadType, realName);

            //Delete previously used file
            if (uploadPath !== previousFilePath) {
                exports.deleteFile(previousFilePath);
            }

            //Delete temp file
            deleteTempFile(file.path);

            callback(uploadPath, err);
        });
    });
};

/**
 *
 * @param filePath the path relative to the 'public' directory
 */
var getAbsolutePathToDeleteFile = function(filePath) {
    var dir = __dirname;
    for (var i = 0; i < APP_CONTROLLER_FOLDER_DEPTH; i++) {
        dir += '/..';
    }
    dir += '/';
    return dir + PUBLIC_FOLDER + filePath;
};

var deleteTempFile = function(tempFilePath) {
    fs.unlinkSync(tempFilePath);
};

exports.deleteFile = function(filePath) {
    fs.unlinkSync(getAbsolutePathToDeleteFile(filePath));
};
