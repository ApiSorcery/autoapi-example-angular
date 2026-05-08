#!/usr/bin/env node

const fs = require('fs');
const path = require('path');

const distPath = path.join(__dirname, '..', 'dist');
const browserPath = path.join(distPath, 'browser');

console.log('Post-build: Moving files from dist/browser to dist...');

// 检查 browser 目录是否存在
if (!fs.existsSync(browserPath)) {
  console.log('No browser directory found, skipping...');
  process.exit(0);
}

// 读取 browser 目录中的所有文件
const files = fs.readdirSync(browserPath);

// 移动每个文件到 dist 目录
files.forEach((file) => {
  const sourcePath = path.join(browserPath, file);
  const targetPath = path.join(distPath, file);

  // 如果目标文件已存在，先删除
  if (fs.existsSync(targetPath)) {
    if (fs.statSync(targetPath).isDirectory()) {
      fs.rmSync(targetPath, { recursive: true, force: true });
    } else {
      fs.unlinkSync(targetPath);
    }
  }

  // 移动文件或目录
  fs.renameSync(sourcePath, targetPath);
  console.log(`  Moved: ${file}`);
});

// 删除空的 browser 目录
fs.rmdirSync(browserPath);
console.log('Post-build: Cleanup complete. Files are now directly in dist/');
