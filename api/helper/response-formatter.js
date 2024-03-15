function successfullyCreatedResponse(data) {
    return {
        headers: {
            'Content-Type': 'application/json',
        },
        statusCode: 201,
        body: {data}
    }
}
function successfullyDeletedResponse(data) {
    return {
        headers: {
            'Content-Type': 'application/json',
        },
        statusCode: 204,
        body: {
            data
        }
    }
}
function successfullyUpdatedResponse(data) {
    return {
        headers: {
            'Content-Type': 'application/json',
        },
        statusCode: 200,
        body: {data}
    }
}
function successfulResponse(data) {
    return {
        headers: {
            'Content-Type': 'application/json'
        },
        statusCode: 200,
        body: {data} 
    }
}
function serverErrorResponse(error) {
    return {
        headers: {
            'Content-Type': 'application/json'
        },
        statusCode: 500,
        body: { error }
    }
}
function badRequestResponse(error) {
    return {
        headers: {
            'Content-Type': 'application/json'
        },
        statusCode: 400,
        body: { error }
    }
}
export {
    successfullyCreatedResponse,
    successfulResponse,
    serverErrorResponse,
    badRequestResponse,
    successfullyUpdatedResponse,
    successfullyDeletedResponse
}