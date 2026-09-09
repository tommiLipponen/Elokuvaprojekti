const bcrypt = require('bcrypt');

const createUser = async (email, password) => {
    const hashedPassword = await bcrypt.hash(password, 10);

    const user = {
        email,
        password: hashedPassword,
    };
    return user;
};

module.exports = { createUser };