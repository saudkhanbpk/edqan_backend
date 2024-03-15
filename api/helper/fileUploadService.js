import formidable from 'formidable';
import fs from 'fs/promises';
import { RequiredParameterError, InvalidPropertyError } from '../error/errors.js';
import path from "path"
const __dirname = path.resolve();

// req: is the request
// fileUploadResource: is the directory where the files will be placed
// resourceImageAttributeNames: is the attributes in the request where the files will be sent in

async function fileUploadService(req, fileUploadResource, resourceImageAttributeNames, fileIsOptional, mimeTypeValue, hasMultipleFiles) {
    await createFolder(`${__dirname}/uploads`);

    let allFilesAreValidFlag = true;
    const form = formidable({
        uploadDir: "uploads/" + fileUploadResource,
        keepExtensions: true,
        maxFileSize: 25 * 1024 * 1024, //25 MB
        filename: (name, ext, part, form) => new Date().toISOString().replace(/:/g, '-') + Math.random() + ext,
        filter: ({ name, originalFilename, mimetype }) => {
            if (Array.isArray(mimeTypeValue)) {
                for (const mimeType of mimeTypeValue) {
                    if (!mimetype || !mimetype.includes(mimeType)) { allFilesAreValidFlag = false }
                    else{
                        allFilesAreValidFlag = true;
                    }
                    if (allFilesAreValidFlag == true) {
                        return allFilesAreValidFlag;
                    }
                }
            }
            else {
                if (!mimetype || !mimetype.includes(mimeTypeValue)) allFilesAreValidFlag = false;
                return allFilesAreValidFlag;
            }
        },
        multiples: !!hasMultipleFiles
    });
    return new Promise(async (res, rej) => {
        try { // search why I need to add try/catch block inside an async block of code to catch error, because errors are not caught in the main try/catch block in the expressCallBack
            await createFolder(`${__dirname}/uploads/${fileUploadResource}`);

            //TODO: future work to validate the request before persisting files on hard disk
            form.parse(req, async (err, fields, files) => {
                try { // search why I need to add try/catch block inside an async block of code to catch error, because errors are not caught in the main try/catch block in the expressCallBack
                    if (err) return rej(err);

                    let fileFields = Object.keys(files);
                    if (!fileIsOptional) if (fileFields.length === 0) return rej(new RequiredParameterError(resourceImageAttributeNames));
                    if (hasMultipleFiles) {
                        for (const fileFieldKey of fileFields) {// to get the file attribute from the request
                            fields[fileFieldKey] = [];
                            // this condition tests whether the key sent has multiple files while the hasMultipleFiles flag is true, this is useful when sending 2 properties one that has multiple files and the other is not, (needs to be refactored since code duplication with the block that starts with line 63)
                            if (!Array.isArray(files[fileFieldKey])) {
                                for (const fileFieldKey of fileFields) {// to get the file attribute from the request
                                    if (!resourceImageAttributeNames.includes(fileFieldKey)) {
                                        await fs.unlink(files[fileFieldKey]['filepath']); //delete the uploaded image if the image was uploaded under a different attribute than what's in the entity
                                        continue;//continue looping over the other file fields
                                    }
                                    fields[fileFieldKey] = `${process.env.SERVER_URL}uploads/${fileUploadResource}/${files[fileFieldKey]['newFilename']}`; // adding the file attribute to fields object
                                }
                            } else {
                                for (const fileObject of files[fileFieldKey]) {

                                    if (!resourceImageAttributeNames.includes(fileFieldKey)) {
                                        await fs.unlink(fileObject['filepath']); //delete the uploaded image if the image was uploaded under a different attribute than what's in the entity
                                        continue;//continue looping over the other file fields
                                    }
                                    fields[fileFieldKey].push(`${process.env.SERVER_URL}uploads/${fileUploadResource}/${fileObject['newFilename']}`); // adding the file attribute to fields object
                                }
                            }
                        }
                    } else {
                        for (const fileFieldKey of fileFields) {// to get the file attribute from the request
                            if (!resourceImageAttributeNames.includes(fileFieldKey)) {
                                await fs.unlink(files[fileFieldKey]['filepath']); //delete the uploaded image if the image was uploaded under a different attribute than what's in the entity
                                continue;//continue looping over the other file fields
                            }
                            fields[fileFieldKey] = `${process.env.SERVER_URL}uploads/${fileUploadResource}/${files[fileFieldKey]['newFilename']}`; // adding the file attribute to fields object
                        }
                    }
                    // const isEmpty = Object.keys(files).length === 0
                    // if(isEmpty)throw new InvalidPropertyError("enter a valid " + resourceImageAttributeNames);
                    res(fields);
                } catch (error) {
                    rej(error)
                }
            });
        } catch (error) {
            rej(error)
        }
    })
}

async function createFolder(path) {
    //checks if the folder exists, if not it will throw and error and I will create a folder in the catch phrase
    try {
        await fs.readdir(path);
    } catch (error) {
        await fs.mkdir(path);
    }
}

const fileMimeType = Object.freeze({
    PDF: "pdf",
    IMAGE: "image",
    VIDEO: 'video',
    // EXCEL:'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
    EXCEL_XLSX: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
});

// const fileUploadResources = Object.freeze({
//     GAME: 'game',
//     PRODUCT: 'product',
//     CATEGORY: 'category',
//     SUB_CATEGORY: 'sub-category'
// });
export {
    fileUploadService,
    // fileUploadResources,
    fileMimeType
}