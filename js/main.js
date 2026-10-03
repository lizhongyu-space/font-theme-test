//main.js
// 主题切换:点按钮在 light 和 dark 之间切换,并记住选择

const root = document.documentElement;
root.dataset.theme = localStorage.getItem('theme') || 'light';
document.getElementById('themeBtn').onclick = () => {
  root.dataset.theme = root.dataset.theme === 'dark' ? 'light' : 'dark';
  localStorage.setItem('theme', root.dataset.theme);
};

// 字体切换:下拉框选哪个字体,整个页面就换成哪个字体
document.getElementById('fontSelect').onchange = (e) => {
  document.body.style.fontFamily = e.target.value;
};

// 侧栏折叠:点 ☰ 按钮,在展开和折叠(只显示首字母)之间切换
document.getElementById('toggle').onclick = () => {
  document.body.classList.toggle('collapsed');
};