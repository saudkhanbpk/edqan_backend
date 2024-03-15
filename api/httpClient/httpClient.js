import axios from 'axios';

async function createPostRequest(url, body, headers, config) {
    try {
        const response = await axios.post(url, body, {
            headers: {
                ...headers,
                'Accept-Encoding': 'application/json'
            },
            ...config
        });
        return (response.data);
    } catch (error) {
        throw new Error(error.response.data.message || error.response.data.error)
    }
}
async function createGetRequest(url, headers) {
    try {
        const response = await axios.get(url, {
            headers: {
                ...headers,
                'Accept-Encoding': 'application/json'
            }
        });
        return (response.data);
    } catch (error) {
        throw new Error(error.response.data.message)
    }
}

export default {
    createPostRequest,
    createGetRequest
}