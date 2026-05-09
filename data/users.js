const bcrypt = require('bcryptjs');

const users = [
    {
        id: 1,
        username: "test",
        password: bcrypt.hashSync("123456", 10)
    }
];

module.exports = users;