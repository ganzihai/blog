module.exports = {
  content: [
    "./public/**/*.html"
  ],
  css: [
    "./public/css/*.css"
  ],
  output: "./public/css/purged",
  // 可选：添加 safelist 以保留某些可能被误删的类
  safelist: [
    /^search-/,
    /^algolia/,
    /dark/,
    /active/,
    /open/,
    /show/,
    /hidden/
  ]
};
