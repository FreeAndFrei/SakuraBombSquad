const db = require('./database');
const auth = require('./auth');
const path = require('path');
const moment = require('moment');
const marked = require('marked');


function submit(req, res) {

    if (req.fileValidationError) {
        return res.render('error', { message: 'Don`t blow our server up! Limit: 50MB' });
    }
    const { content } = req.body;
    const attachmentPath = req.file ? '/uploads/' + req.file.filename : null;

    const stmt = db.prepare("INSERT INTO messages (content, created_at, attachment) VALUES (?, ?, ?)");
    stmt.run(content, moment().format('YYYY-MM-DD HH:mm:ss'), attachmentPath, (err) => {
        if (err) {
            return res.status(500).send("Error saving message" + err);
        }
        res.redirect('/');
    });
    stmt.finalize();
}


function getMessages(req, res) {
    const dateParam = req.query.date || moment().format('YYYY-MM-DD');
    const startDate = `${dateParam} 00:00:00`;
    const endDate = `${dateParam} 23:59:59`;

    db.all('SELECT * FROM messages WHERE created_at BETWEEN ? AND ? ORDER BY created_at DESC', [startDate, endDate], (err, rows) => {
        if (err) {
            return console.error(err.message);
        }
        rows.forEach(row => {
            row.content = marked.parse(row.content);  // 渲染 Markdown 内容
        });
        res.render('index', {
            title: 'Home',
            messages: rows,
            selectedDate: dateParam,
            user: req.session.user || null,
            path: path
        });
    });
}


function setupMessageRoutes(app) {
    // 显示消息的路由
    app.get('/', (req, res) => {
        auth.routeUser(req, res, getMessages, getMessages, getMessages);
    });

    // 上传文件路由
    app.post('/submit', (req, res) => {
        auth.routeUser(req, res, null, submit, submit)
    });
}

module.exports = { setupMessageRoutes };
