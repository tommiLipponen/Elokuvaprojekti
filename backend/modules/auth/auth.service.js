import brypt from 'bcrypt';

export const createUser = async (email, password) => {
    const hashedPassword = await brypt.hash(password, 10);

    const user = {
        email,
        password: hashedPassword,
    };
    return user;
};