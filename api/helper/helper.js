import dateFns from "date-fns";
import httpClient from "../httpClient/httpClient.js";

function trimAndRemoveSpaces(value) {
  if (value === undefined || !value) return value;
  else if (value instanceof Array) {
    for (let i = 0; i < value.length; i++) {
      value[i] = String(value[i]).replace(/\s+/g, " ").trim();
    }
    return value;
  } else {
    return String(value).replace(/\s+/g, " ").trim();
  }
}

function toBoolean(val) {
  if (typeof val === "boolean") return val;
  if (val === "false") return false;
  else if (val === "true") return true;
  return false;
}

function compareDates(dateBig, dateSmall) {
  // Compare the two dates and return 1 if the first date is after the second, -1 if the first date is before the second or 0 if dates are equal.
  return dateFns.compareAsc(dateBig, dateSmall) === 1 ? true : false;
}

async function verifyCaptcha(captchaValue) {
  try {
    let response = await httpClient.createPostRequest(
      `https://www.google.com/recaptcha/api/siteverify?secret=${process.env.CAPTCHA_SECRET}&response=${captchaValue}`
    );
    if (response?.success) return true;
    throw new Error("Error verifying CAPTCHA");
  } catch (error) {
    throw error;
  }
}

export { trimAndRemoveSpaces, toBoolean, compareDates, verifyCaptcha };
