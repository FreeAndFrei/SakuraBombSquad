const sqlite3 = require('sqlite3').verbose();

// 创建数据库
const db = new sqlite3.Database('data.db');

// 创建用户表
db.serialize(() => {
    db.run(`
        CREATE TABLE IF NOT EXISTS users (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            name TEXT NOT NULL,
            class TEXT NOT NULL,
            grade INTEGER NOT NULL,
            username TEXT NOT NULL UNIQUE,
            password TEXT NOT NULL,
            level INTEGER,
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        )
    `);


    db.run(`
        CREATE TABLE IF NOT EXISTS messages (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            content TEXT NOT NULL,
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
            attachment TEXT
        )
    `);
});

db.run('PRAGMA encoding = "UTF-8";');
module.exports = db;
