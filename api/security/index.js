import jwt from "../helper/jwt.js";
import { makeCheckAuth, makeCheckAccess, makeRequestBodyFilter, makeResponseBodyFilter, makeAdminAuth } from "./auth.js";
import { UnauthorizedError, ForbiddenError } from "../error/errors.js";
import { roles, resources, adminRoles } from "./accessControl.js";
import { userRepo, adminRepo } from "../data-access-layer/index.js"; //I import the user repo after I import the roles because the repo's model has a dependency over the roles

const checkAuth = makeCheckAuth({ jwt, ForbiddenError, userRepo, adminRepo });
const adminAuth = makeAdminAuth({ jwt, adminRepo });
const checkAccess = makeCheckAccess({ UnauthorizedError });
const requestBodyFilter = makeRequestBodyFilter();
const responseBodyFilter = makeResponseBodyFilter();

export { checkAuth, checkAccess, requestBodyFilter, responseBodyFilter, adminAuth, roles, adminRoles, resources };
