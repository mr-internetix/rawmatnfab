const config = require('../../config.json');
const jwt = require('jsonwebtoken');
const { convertToHash, compareHash } = require('./hashing.functions')
const Users = require('../../models/users');

module.exports = {
    authenticate,
    getAll,
    createUser
};

async function createUser({ email, password }) {
    if (!email | !password) {
        return { "message": "email password required !" }
    }

    const registereduser = await Users.find({ "email": email })
    if (registereduser.length === 0) {
        const newuser = new Users({
            "email": email,
            "password": await convertToHash(password)
        })

        response = await newuser.save()

        return { "message": "user created !" }
    } else {
        return { "message": " user already exist" }
    }


    return { "message": "email password recieved " }


}



async function authenticate({ username, password }) {
    const currentUser = await Users.find({ email: username })
    if (currentUser.length === 0) {
        return { "message": "User do not Exists !" }
    }
    const email = currentUser[0].email;
    const db_password = currentUser[0].password;
    const isRightPassword = await compareHash(password, db_password);
    const user = email === username && isRightPassword ? true : false;

    if (!user) return { "message": "Username or password is incorrect" };

    // create a jwt token that is valid for 7 days
    const token = jwt.sign({ sub: user.id }, config.secret, { expiresIn: '7d' });

    return {
        token
    };
}



async function getAll() {
    const allUsers = await Users.find({})
    data = allUsers.map(u => omitPassword(u));
    return [...data]
}

// helper functions

function omitPassword(user) {
    return { "email": user.email }
}