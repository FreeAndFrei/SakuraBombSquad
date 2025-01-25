const auth = require("./auth");
const path = require("path");
const moment = require("moment/moment");
const db = require("./database");
const marked = require("marked");

function setupAdminRoutes(app) {
    // 显示消息的路由
    app.get('/admin', (req, res) => {
        auth.routeUser(req, res, null, null, (req, res) => {
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
                res.render('admin', {
                    title: 'Admin Panel',
                    messages: rows,
                    selectedDate: dateParam,
                    user: req.session.user || null,
                    path: path
                });
            });
        });
    });

    // 上传文件路由
    app.post('/admin/delete-post', (req, res) => {
        auth.routeUser(req, res, null, null, (req, res) => {
            db.run('DELETE FROM messages where id = ?', [req.body.post_id], (err) => {
                if (err) {
                    return res.render('error', {
                        title: 'Error deleting post',
                        message: err.message
                    })
                }
                res.redirect('/admin');
            });
        })
    });

    app.post('/admin/add-admin', (req, res) => {
        auth.routeUser(req, res, null, null, (req, res) => {

            // 更新用户信息
            const stmt = db.prepare("UPDATE users SET level = ? WHERE username = ?");
            stmt.run(3, req.body.new_admin, (err) => {
                if (err) {
                    return res.render('error', { title:'Error', message: 'Failed to add admin' + err });
                }
                console.log(req.body);
                res.redirect('/admin');
            });
            stmt.finalize();
        })
    })
}

module.exports = { setupAdminRoutes };
