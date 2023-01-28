const bcrypt = require('bcrypt');

async function convertToHash(current_user_password) {
    const salt = await bcrypt.genSalt(10);
    const hashed = await bcrypt.hash(current_user_password, salt);
    return hashed.toString()
}


async function compareHash(password, current_user_password) {
    const validPassword = await bcrypt.compare(password, current_user_password);
    return validPassword
}


module.exports = { convertToHash, compareHash }