// 获取侧边栏按钮和侧边栏元素
const toggleBtn = document.getElementById('toggle-btn');
const sidebar = document.getElementById('sidebar');

// 监听按钮点击事件，切换侧边栏的显示/隐藏状态
toggleBtn.addEventListener('click', () => {
    // 切换 'active' 类，控制侧边栏的显示和隐藏
    sidebar.classList.toggle('active');
});
