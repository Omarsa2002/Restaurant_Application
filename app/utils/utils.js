const AWS_S3 = require('aws-sdk/clients/s3');
let AWS = require("aws-sdk");
const { app: ENVIRONMENT, DEV, PROD } = require('../../config/config');
const s3BucketRoot = (ENVIRONMENT === 'dev') ? DEV['s3BucketRoot'] : PROD['s3BucketRoot'];
const mongoose = require('mongoose')
const sharp = require('sharp');
const csvtojson = require('csvtojson/v2')
const MESSAGES = require('./constants');

const MomentRange = require('moment-range');
const Moment = require('moment');
const moment = MomentRange.extendMoment(Moment);

const fs = require('fs');

function readCSVFile(filePath) {
  try {
    const csvData = fs.readFileSync(filePath, 'utf8');
    return csvData;
  } catch (err) {
    console.error(err);
    return null;
  }
}

const currentDate = (inputDate) => {
    return moment();
}

function omit(obj, keys) {
    return Object.keys(obj)
      .filter(key => !keys.includes(key))
      .reduce((acc, key) => {
        acc[key] = obj[key];
        return acc;
      }, {});
}
  
const csvToObject = async(csvStr,options) => {
    return await csvtojson(options ? options : {} ).fromString(csvStr)
}

const objectToCsv = (headers, object) => {
    let csvString = ''
    headers.forEach(el => csvString+= el + ',')
    csvString += '\n'
    object.forEach((element) => {
      headers.forEach((el) => csvString+= `"${element[el] ?? '' }"`   + ',')
      csvString+= '\n'
    })
    return csvString
}


const compressImage = async(buffer, ext) => {
    let newBuff, error;
    if(ext !== 'svg' && ext !== 'png'){
        await sharp(buffer)
            .jpeg({ mozjpeg: true })
            .toBuffer()
            .then(data => newBuff = data)
            .catch(err => error = err)
        if(error){
            console.log("error while compressing: ", error)
            return [buffer, ext];
        }
        return [newBuff, 'jpeg'];
    }else return ext === 'svg' ? [buffer, 'svg'] : [buffer, 'png'];
}

const getDate = () => {
    const dateValue = new Date();
    return dateValue.toISOString()
}
  
function writeToJson(data, outputFilePath) {
    const jsonData = JSON.stringify(data, null, 4);
    fs.writeFileSync(outputFilePath, jsonData);
    console.log(`Data successfully written to ${outputFilePath}.`);
}

  

module.exports = {
    updateProdTypeBrandsPopularity, computePrice, isValidBase, getPriceTaxBaseVal, readCSVFile, writeImageFileToS3, 
    writeJSONFileToS3, removeJSONFileFromS3, getAuditInfo, CFInvalidateCache, getConfig, createImage, compressImage, 
    getCSVFileContentFromS3, csvToObject, omit, objectToCsv, writeCSVFileToS3, getDate, currentDate, writeToJson, getFileFromS3
}

