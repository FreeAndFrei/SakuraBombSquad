const bcrypt = require('bcrypt');
const db = require('./database');

function setupAuthRoutes(app) {
    // 显示注册页面
    app.get('/register', (req, res) => {
        res.render('register', { title: 'Register', message: '' });
    });

    // 显示登录页面
    app.get('/login', (req, res) => {
        res.render('login', { title: 'Login', message: '' });
    });

    // 登录处理逻辑
    app.post('/login', (req, res) => {
        const { username, password } = req.body;

        db.get('SELECT * FROM users WHERE username = ?', [username], (err, user) => {
            if (err || !user || !bcrypt.compareSync(password, user.password)) {
                return res.render('login', {
                    title: 'Login',
                    message: 'Invalid username or password'  // 登录失败时传递 message
                });
            }

            req.session.user = user; // 登录成功，存储用户信息
            res.redirect('/');
        });
    });

    // 登出处理逻辑
    app.get('/logout', (req, res) => {
        req.session.destroy(() => {
            res.redirect('/');
        });
    });

    // 注册处理逻辑
    app.post('/register', (req, res) => {
        const { gradeName, className, fullName, username, password } = req.body;

        if (!gradeName || !className || !fullName || !username || !password) {
            return res.render('register', {
                title: 'Register',
                message: 'All fields are required!'
            });
        }

        db.get('SELECT * FROM users WHERE username = ?', [username], (err, user) => {
            if (err || user) {
                return res.render('register', {
                    title: 'Register',
                    message: 'Username is already taken or error occurred.'
                });
            }

            const hashedPassword = bcrypt.hashSync(password, 10);

            db.run('INSERT INTO users (grade, class, name, username, password, level) VALUES (?, ?, ?, ?, ?, ?)',
                [gradeName, className, fullName, username, hashedPassword, 0],
                function (err) {
                    if (err) {
                        return res.render('register', {
                            title: 'Register',
                            message: 'Error registering user. ' + err
                        });
                    }
                    res.redirect('/login');
                });
        });
    });
}


function routeUser(req, res, not_logged_in, logged_in, admin) {

    const user = req.session.user;
    console.log(user);
    if (!user) {
        if (not_logged_in) {
            return not_logged_in(req, res);
        } else {
            return res.redirect('/login'); // 如果没有登录，跳转到登录页
        }
    }

    db.get('SELECT * FROM users WHERE username = ?', [req.session.user.username], (err, user) => {
        if (err) {
            return res.render('error', {
                title: 'Error at checkUser()',
                message: err
            })
        }

        if (err || !user || req.session.user.password !== user.password) {
            return res.render('login', {
                title: 'Login',
                message: 'Invalid username or password'  // 登录失败时传递 message
            });
        }

        if (user.level >= 3) {
            if (admin) {
                return admin(req, res);
            }
            return res.redirect('/admin');
        } else{
            if (logged_in) {
                return logged_in(req, res);
            }
            return res.redirect('/');
        }
    });
}

module.exports = { setupAuthRoutes, routeUser };
