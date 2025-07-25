# node版本, pnpm版本

- `node: >= v18`
- `pnpm: >= v9`

# install

```bash
npm i pnpm -g

pnpm i
```

# dev

```bash
# use test env
# 在.env.development中配置
npm run dev

# or use mock
npm run dev:mock
```

# 项目根目录安装pacakge

```bash
# dependencies
pnpm add xxx -w

# devDependencies
pnpm add xxx -Dw
```

# 子项目安装依赖包

- 安装到子项目, 例如`@core/api` （`名称对应子项目的package.json中的name`）

```bash
# dependecies
pnpm add axios -F @core/api

# devDependencies
pnpm add axios -F @core/api -D
````

# 子项目中安装其他子项目

- 例如, 在`@app/main`中安装`@core/api`

```bash
pnpm add @core/api -F @app/main
```