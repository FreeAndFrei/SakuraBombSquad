const db = require('./database');
const bcrypt = require('bcrypt');

db.run('INSERT INTO users (grade, class, name, username, password, level) VALUES (?, ?, ?, ?, ?, ?)',
    [0, 0, 'root', 'root', bcrypt.hashSync('114514', 10), 3]);

console.log('Admin added to the database. ');
