module.exports = { // https://juejin.cn/post/6901943749916491783
  plugins: [
    require("tailwindcss"),
    require('autoprefixer')({
      add: true,
      grid: false
    }),
    require('postcss-flexbugs-fixes'),
  ],
};
