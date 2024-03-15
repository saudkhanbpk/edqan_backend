import validator from "validator";
import mongoose from "mongoose";
import validUrl from "valid-url";
import validDate from "validate-date";

function isAlpha(text) {
  // const arabic = /[\u0600-\u06FF]/;
  // return validator.isAlpha(text, arabic.test(text) ? 'ar' : undefined, { ignore: ' ' });
  return text;
}
function isObjectId(id) {
  return mongoose.isValidObjectId(id);
}
function isNumeric(number) {
  return validator.isNumeric(number.toString());
}
function isStrongPassword(text) {
  return validator.isStrongPassword(text, { minLength: 12 });
}
function isEmail(text) {
  if (!text) return true;
  return validator.isEmail(text);
}
function isStringPath(path) {
  return path.includes("/uploads/");
}
function isAlphaNumeric(text) {
  // const arabic = /[\u0600-\u06FF]/;
  // return validator.isAlphanumeric(text, arabic.test(text) ? 'ar' : undefined, { ignore: '/ .' }); // a regex that includes space and dot
  return text;
}
function isStringArr(arr) {
  if (arr.length === 0) return false; // checks if the array is empty
  //returns false if any array member is not populated and is not string
  arr.forEach((element) => {
    if (!element && typeof element !== "string") return false;
  });
  return true;
}
function isValidUrl(value) {
  return validUrl.isUri(value);
}
function isValidDate(value) {
  try {
    if (value instanceof Date) return true;
    return validDate(value);
  } catch (error) {
  }
}
function isNullOrUndefined(val) {
  if (!val || val === "undefined" || val === "null") return true;
  return false;
}
function nullify(str) {
  str = String(str)
  str = str.trim()
  if(str == 'null') return null
  else if (str == 'undefined') return undefined
  else return str
}
function isAlphaNumericArr(arr) {
  if (arr.length === 0) return false; // checks if the array is empty
  //returns false if any array member is not populated and is not string
  arr.forEach((element) => {
    if (!element && !isAlphaNumeric(element)) return false;
  });
  return true;
}

export {
  isAlpha,
  isNumeric,
  isAlphaNumeric,
  isStrongPassword,
  isEmail,
  isStringArr,
  isAlphaNumericArr,
  isObjectId,
  isNullOrUndefined,
  isStringPath,
  isValidUrl,
  isValidDate,
  nullify
};
