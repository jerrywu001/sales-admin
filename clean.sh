#!/bin/bash

# 删除当前目录下的 node_modules 和 dist 文件夹
rm -rf node_modules
rm -rf pnpm-lock.yaml

# 删除 tailwindconfig 目录下的 node_modules
cd tailwindconfig
rm -rf node_modules
cd ..

# 删除 mocks 目录下的 node_modules
cd mocks
rm -rf node_modules
cd ..

# 删除 docs 目录下的 node_modules
cd docs
rm -rf node_modules
cd ..

cd assets
rm -rf node_modules
cd ../auth
rm -rf node_modules

cd ..

# 删除 core/api 目录下的 node_modules
cd core/api
rm -rf node_modules
cd ../tools

# 删除 tools 目录下的 node_modules
rm -rf node_modules
cd ../main

rm -rf node_modules
cd ../..

# 删除 components/vue3 目录下的 node_modules
cd components/vue3
rm -rf node_modules
cd ../..

# 删除 apps/login 目录下的 dist 和 node_modules
cd apps/login
rm -rf dist
rm -rf node_modules

cd ../main
rm -rf dist
rm -rf node_modules

cd ../rent
rm -rf dist
rm -rf node_modules

cd ../..

# 删除 .husky 目录下的 _
cd .husky
rm -rf _
cd ..

echo "*********clean success*******"
