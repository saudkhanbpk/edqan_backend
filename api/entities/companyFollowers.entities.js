import { trimAndRemoveSpaces } from "../helper/helper.js";
import { isObjectId } from "../helper/validation.js";
import { RequiredParameterError, InvalidPropertyError } from "../error/errors.js";

function makeCompanyFollowers({ company, user }) {
  //#region company validation
  if (typeof company === "string") company = trimAndRemoveSpaces(company);
  if (!company) {
    throw new RequiredParameterError("company");
  }
  if (!isObjectId(company)) {
    throw new InvalidPropertyError("company must include a company ID");
  }
  //#endregion company validation

  //#region user validation
  if (typeof user === "string") user = trimAndRemoveSpaces(user);
  if (!user) {
    throw new RequiredParameterError("user");
  }
  if (!isObjectId(user)) {
    throw new InvalidPropertyError("user must include a user ID");
  }
  //#endregion user validation
  return Object.freeze({
    user,
    company,
  });
}
export default makeCompanyFollowers;
