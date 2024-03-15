import dotEnv from 'dotenv';
dotEnv.config();

import jwt from 'jsonwebtoken';

async function sign(payload) {
    return await jwt.sign(payload, process.env.USER_JWT_PRIVATE_KEY);
}
async function verify(token) {
    return await jwt.verify(token, process.env.USER_JWT_PRIVATE_KEY);
}
async function signUserVerificationToken() {
    return await jwt.sign({}, process.env.USER_VERIFICATION_JWT_PRIVATE_KEY, { expiresIn: '10m' });
}
async function verifyUserVerificationToken(token) {
    return await jwt.verify(token, process.env.USER_VERIFICATION_JWT_PRIVATE_KEY);
}
async function signUserPasswordResetToken() {
    return await jwt.sign({}, process.env.USER_PASSWORD_RESET_JWT_PRIVATE_KEY, { expiresIn: '10m' });
}
async function verifyUserPasswordResetToken(token) {
    return await jwt.verify(token, process.env.USER_PASSWORD_RESET_JWT_PRIVATE_KEY);
}

export default {
    sign,
    verify,
    signUserVerificationToken,
    verifyUserVerificationToken,
    signUserPasswordResetToken,
    verifyUserPasswordResetToken
}