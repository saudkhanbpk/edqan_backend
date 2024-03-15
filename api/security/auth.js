import mongoose from "mongoose";
import { accessControl, adminRoles } from "./accessControl.js";

export function makeCheckAuth({ jwt, userRepo, adminRepo, ForbiddenError }) {
  return async function checkAuth(req, res, next) {
    try {
      const token = req.headers.authorization.split(" ")[1];
      const verifiedToken = await jwt.verify(token);
      if (Object.values(adminRoles).includes(verifiedToken.role)) req.admin = await adminRepo.findById(verifiedToken._id);
      else req.user = await userRepo.findById(verifiedToken._id);

      if (!req.user && !req.admin) throw "";

      next();
    } catch (error) {
      next(new ForbiddenError());
    }
  };
}
export function makeAdminAuth({ jwt, adminRepo }) {
  return async function adminAuth(req, res, next) {
    try {
      const token = req?.headers?.authorization?.split(" ")[1];
      if (token) {
        const verifiedToken = await jwt.verify(token);
        if (Object.values(adminRoles).includes(verifiedToken.role)) req.admin = await adminRepo.findById(verifiedToken._id);
      }

      next();
    } catch (error) {
      next(error);
    }
  };
}
export function makeCheckAccess({ UnauthorizedError }) {
  return function checkAccess(action, resource) {
    return (req, res, next) => {
      try {
        let permission = accessControl.permission({
          role: req.originalUrl.includes("signup") ? "user" : req.user.role, // to check for user signup, to filter data while user signing up
          action: action,
          resource: resource,
        });

        if (!permission.granted) return next(new UnauthorizedError());
        req.accessControl = permission;
        next();
      } catch (error) {
        next(error);
      }
    };
  };
}
export function makeRequestBodyFilter() {
  return function requestBodyFilter(httpRequest) {
    // if (req.originalUrl.includes('signup')) {//to check for user signup, to filter data while user signing up
    //     // req.body = { ...req.body }; // to copy the req.body object because it's sent with form data method so the object is received but not like normal json, it's received as [Object: null prototype] to be checked later
    //     // if (req.body.role === roles.BUSINESS) req.body.business = JSON.parse(req.body.business);
    //     // else req.body.personal = JSON.parse(req.body.personal);
    // }
    return httpRequest.accessControl.filter(httpRequest.body);
  };
}
export function makeResponseBodyFilter() {
  return function responseBodyFilter(httpRequest, response) {
    let tpBeFilteredResponse;
    response._doc ? (tpBeFilteredResponse = response._doc) : (tpBeFilteredResponse = response); // to handled un-leaned
    objectIdToString(tpBeFilteredResponse.body);
    return httpRequest.accessControl.filter(tpBeFilteredResponse.body);
  };
}
//TODO: not a permanent solution check if it can be replaced by aggregation methods in mongo
function objectIdToString(data) {
  if (data instanceof Array) {
    for (const entry of data) {
      objectIdToString(entry);
    }
  }
  for (const key in data) {
    if (data[key] instanceof mongoose.Types.ObjectId) data[key] = String(data[key]);
  }
}
