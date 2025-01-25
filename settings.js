const db = require('./database');
const bcrypt = require("bcrypt");

function setupSettingsRoutes(app) {

    // 显示用户设置页面
    app.get('/settings', (req, res) => {
        const user = req.session.user;
        if (!user) {
            return res.redirect('/login'); // 如果用户没有登录，跳转到登录页面
        }
        const { username, password } = req.body;
        db.get('SELECT * FROM users WHERE username = ?', [username], (err, user) => {
            if (err || !user || !bcrypt.compareSync(password, user.password)) {
                return res.render('login', {
                    title: 'Login',
                    message: 'Invalid username or password'  // 登录失败时传递 message
                });
            }
        });
        res.render('settings', { user: user, title: 'Settings' });
    });

    // 处理设置表单提交
    app.post('/settings', (req, res) => {
        const user = req.session.user;
        if (!user) {
            return res.redirect('/login'); // 如果用户没有登录，跳转到登录页面
        }

        const { username, password, confirm_password } = req.body;

        // 验证新密码和确认密码是否一致
        if (password && !bcrypt.compareSync(confirm_password, user.password)) {
            return res.render('error', { title:'Error', message: 'Original password does not match' });
        }

        let hashedPassword = bcrypt.hashSync(password, 10);

        // 更新用户信息
        const stmt = db.prepare("UPDATE users SET username = ?, password = ? WHERE username = ?");
        stmt.run(username, hashedPassword, user.username, (err) => {
            if (err) {
                return res.render('error', { title:'Error', message: 'Failed to update info' + err });
            }
            // 更新成功后，更新 session 中的用户数据
            req.session.user.username = username;
            if (password) {
                req.session.user.password = hashedPassword;
            }
            res.redirect('/settings'); // 成功后返回设置页面
        });
        stmt.finalize();
    });

    // 删除账户
    app.post('/delete-account', (req, res) => {
        const user = req.session.user;
        if (!user) {
            return res.redirect('/login'); // 如果用户没有登录，跳转到登录页面
        }

        const stmt = db.prepare("DELETE FROM users WHERE username = ?");
        stmt.run(user.username, (err) => {
            if (err) {
                return res.render('error', { title:'Error', message: 'Error deleting account ' + err });
            }
            // 删除成功后，销毁用户会话
            req.session.destroy((err) => {
                if (err) {
                    return res.render('error', { title:'Error', message: 'Error logging out' });
                }
                res.redirect('/'); // 返回主页
            });
        });
        stmt.finalize();
    });
}

module.exports = { setupSettingsRoutes };
