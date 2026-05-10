const bcrypt = require('bcryptjs');

const users = [
    {
        id: 1,
        username: "test",
        password: bcrypt.hashSync("123456", 10)
    },
    {
        id: 2,
        username: "admin",
        password: bcrypt.hashSync("123", 10)
    },
    {
        id: 3,
        username: "apo",
        password: bcrypt.hashSync("apo123", 10)
    }
];

module.exports = users;