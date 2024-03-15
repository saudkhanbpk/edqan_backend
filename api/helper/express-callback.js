import {
    requestBodyFilter,
    responseBodyFilter
} from '../security/index.js';

export default function makeExpressCallBack(controller) {
    return async (req, res, next) => {
        try {
            const httpRequest = {
                body: req.body,
                query: req.query,
                params: req.params,
                // ip: req.ip,
                method: req.method,
                path: req.path,
                accessControl: req?.accessControl,
                headers: req,
                token: req.headers.authorization || null,
                user: req?.user,
                admin: req?.admin,
                originalReqObject: req, //for file upload because it needs the original request object
                paginationQuery: {
                    page: req?.query?.page ? req?.query?.page : 0,
                    pageSize: req.query?.pageSize ? req.query?.pageSize : 20,
                },
                response: res
            }
            // check user approval
            if (req.user) checkUserApproval(req.user, req);
            //request body filter
            if (httpRequest.accessControl) httpRequest.body = requestBodyFilter(httpRequest);
            //controller call
            const httpResponse = await controller(httpRequest);
            // response filter
            if (httpRequest.accessControl) httpResponse.body = responseBodyFilter(httpRequest, httpResponse);
            if(!httpResponse) return;
            res.status(httpResponse.statusCode).send(httpResponse.body);//httpResponse.body that's the format that the response handler returns
        } catch (error) { //TODO: duplicate error handling one here, and the other is in the main index.js
            next(error);
        }
    }
}
function checkUserApproval(user, req) {
    // only accept requests from approved users that are issuing get requests
    if (!user?.approved) {
        if (req.method !== 'GET' && req.method !== 'PATCH') {
            throw new Error('Once the edqan Team approves your account, you will be able to interact with the system.');
        }
    }
}