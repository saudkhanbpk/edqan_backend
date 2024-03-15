import { hashPassword } from "../helper/password-hash.js";
import { adminRoles } from "../security/accessControl.js";
import { isStrongPassword, isEmail } from "../helper/validation.js";
import { trimAndRemoveSpaces } from "../helper/helper.js";

async function makeAdmin({ email, password, role, isUpdate, firstName, lastName }) {
  //#region email validation
  email = trimAndRemoveSpaces(email);
  email = email.toLowerCase();
  if (!email) throw new RequiredParameterError("email");
  if (!isEmail(email)) throw new InvalidPropertyError("enter a valid email");
  //#endregion email validation

  //#firstName
  firstName = trimAndRemoveSpaces(firstName);
  if (!firstName) throw new RequiredParameterError("first name");

  //# lastName
  lastName = trimAndRemoveSpaces(lastName);
  if (!lastName) throw new RequiredParameterError("last name");
  //#region role validation
  if (role === undefined || role === null) {
    throw new RequiredParameterError("role");
  }
  if (!Object.values(adminRoles).includes(role)) {
    throw new InvalidPropertyError("enter a valid role");
  }
  {
    role = role;
  } //#endregion role validation

  //#region password validation
  if (!isUpdate) {
    password = trimAndRemoveSpaces(password);
    if (!password) throw new RequiredParameterError("password");
    if (!isStrongPassword(password)) throw new InvalidPropertyError("enter a valid password");
    password = await hashPassword(password);
  }
  //#endregion password validation

  return Object.freeze({
    email,
    password,
    role,
    firstName,
    lastName,
  });
}
export default makeAdmin;
