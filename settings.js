const db = require('./database');
const bcrypt = require("bcrypt");
const auth = require('./auth');


function settings(req, res) {
    res.render('settings', { user: req.session.user, title: 'Settings' });
}


function change_settings(req, res) {
    const { username, password, confirm_password } = req.body;
    const user = req.session.user;

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
}

function delete_account(req, res) {
    const stmt = db.prepare("DELETE FROM users WHERE username = ?");
    const user = req.session.user;
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
}


function setupSettingsRoutes(app) {

    // 显示用户设置页面
    app.get('/settings', (req, res) => {
        auth.routeUser(req, res, null, settings, null);
    });

    // 处理设置表单提交
    app.post('/settings', (req, res) => {
        auth.routeUser(req, res, null, change_settings, null);
    });

    // 删除账户
    app.post('/delete-account', (req, res) => {
        auth.routeUser(req, res, null, delete_account, null);
    });
}

module.exports = { setupSettingsRoutes };
