const connection = require('./db');

const User = {};

User.create = (userData, callback) => {
    connection.query('INSERT INTO users SET ?', userData, (err, results) => {
        if (err) {
            return callback(err);
        }
        return callback(null, results);
    });
};

User.findByEmail = (email, callback) => {
    connection.query('SELECT * FROM users WHERE email = ?', email, (err, results) => {
        if (err) {
            return callback(err);
        }
        if (results.length === 0) {
            return callback(null, null); // User not found
        }
        return callback(null, results[0]); // Return the first user found
    });
};

module.exports = User;
