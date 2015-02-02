'use strict';
/**
 * Created by thomascoquel on 02/02/15.
 * Handles file uploads problematics
 */

var errorHandler = require('./errors.server.controller'),
    fs = require('fs');

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
 * @return the path of the stored file, relative to the UPLOAD_BASE_FOLDER
 * @param uploadType
 * @param file
 * @param fileName the desired file name, without extension
 * @param callback the callback function with args: uploadPath, err
 */
exports.storeFile = function(uploadType, file, fileName, callback) {
    var realName = addFileExtensionToFileName(file, fileName);
    var realPath = getRealPathToStoreFile(uploadType, realName);

    fs.readFile(file.path, function (err, data) {
        fs.writeFile(realPath, data, function (err) {
            //console.log(getPublicPath(uploadType, realName));
            callback(getPublicPath(uploadType, realName), err);
        });
    });
};
