const express = require('express');
const expressLayouts = require('express-ejs-layouts');

const session = require('express-session');
const { setupMessageRoutes } = require('./message');
const { setupAuthRoutes } = require('./auth');
const upload = require('./upload');
const { setupSettingsRoutes } = require('./settings');
const { setupAdminRoutes } = require('./admin');

const app = express();
const port = 3000;

// 设置静态资源路径
app.use(express.static('public'));

// 中间件配置
app.use(express.urlencoded({ extended: false }));
app.use(express.json());
app.set('view engine', 'ejs');
app.use(expressLayouts);
app.set('layout', 'layout');

// 使用 session
app.use(session({
    secret: 'your-secret-key',
    resave: false,
    saveUninitialized: true
}));

app.use((req, res, next) => {
    res.locals.user = req.session.user || null; // 如果用户已登录，将用户信息传递给模板
    next();
});

app.use(upload.single('attachment'));

// 注册路由
setupAuthRoutes(app);
setupMessageRoutes(app);
setupSettingsRoutes(app);
setupAdminRoutes(app);

app.get('/about', (req, res) => {
    res.render('about', { title: 'About' });
});


app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}`);
});
