const db = require('./database');

db.run('INSERT INTO users (grade, class, name, username, password, level) VALUES (?, ?, ?, ?, ?, ?)',
    [0, 0, 'root', 'root', 114514, 3]);

console.log('Admin added to the database. ');
