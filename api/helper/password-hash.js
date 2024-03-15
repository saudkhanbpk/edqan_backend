import { hash, compare } from 'bcrypt';

export async function hashPassword(text) {
    return await hash(text, 14);
}

export async function comparePassword(text, hashedText) {
    return await compare(text, hashedText);
}