#!/usr/bin/env bash
set -euo pipefail

# ============================================================
# vscode-explorer install / build script
#   VS Code 扩展：将 SSH 远程 /mnt/z 路径映射为本地 Z:/ 路径
# ============================================================

# 1. 安装依赖
npm install

# 2. 编译 TypeScript → dist/
npm run compile

# 3. 打包为 .vsix
npm run package

# 然后在windows端安装
# code --install-extension .\vscode-explorer-0.0.1.vsix
