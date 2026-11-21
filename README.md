# My Personal Library

一个基于原生 HTML、CSS、JavaScript 的 GitHub Pages 个人公共资料库。无需 Node.js、npm、构建工具、数据库或后端。

## 功能

- 现代卡片式首页、分类导航和统计
- 按标题、描述、分类和标签进行关键词搜索
- 按分类、标签、文件类型筛选
- 最近添加、最早添加、标题排序
- PDF 在线阅读 / 下载（浏览器支持时）
- HTML 笔记和外部链接
- 响应式布局，支持桌面和手机
- 使用 `data/library.json` 管理目录

## 本地预览

不要直接双击 `index.html`，因为浏览器可能阻止 `fetch()` 读取 JSON 文件。

在项目根目录运行任意一个静态 HTTP 服务：

```bash
python -m http.server 8000
```

然后访问：

```text
http://localhost:8000
```

也可以使用 VS Code 的 Live Server 扩展。

## 发布到 GitHub Pages

### 1. 创建仓库

1. 登录 GitHub。
2. 点击 New repository。
3. 仓库名称可以使用 `my-personal-library`。
4. 如果希望通过 GitHub Pages 公开访问，仓库可以设为 Public。
5. 创建仓库。

### 2. 上传项目文件

把本项目中的全部文件和目录上传到仓库根目录。确保 `index.html` 位于仓库根目录，而不是多套了一层文件夹。

可以通过 GitHub 网页端的 **Add file → Upload files** 上传，也可以使用 Git：

```bash
git init
git add .
git commit -m "Initial personal library"
git branch -M main
git remote add origin https://github.com/YOUR_USERNAME/my-personal-library.git
git push -u origin main
```

将 `YOUR_USERNAME` 替换成自己的 GitHub 用户名。

### 3. 开启 GitHub Pages

1. 打开仓库的 **Settings**。
2. 进入左侧 **Pages**。
3. 在 **Build and deployment** 下，将 Source 设为 **Deploy from a branch**。
4. Branch 选择 `main`，目录选择 `/ (root)`。
5. 点击 Save。
6. 等待部署完成。

网站地址通常是：

```text
https://YOUR_USERNAME.github.io/my-personal-library/
```

如果仓库名是 `YOUR_USERNAME.github.io`，网站地址则是：

```text
https://YOUR_USERNAME.github.io/
```

## 如何添加 PDF

### 1. 上传文件

例如把文件上传到：

```text
documents/programming/react/react19-guide.pdf
```

### 2. 修改目录文件

编辑 `data/library.json`，在 JSON 数组中增加一项：

```json
{
  "title": "React 19 完整指南",
  "category": "Programming",
  "tags": ["React", "JavaScript", "Frontend"],
  "description": "React 19 的学习资料与参考文档。",
  "file": "documents/programming/react/react19-guide.pdf",
  "type": "pdf",
  "date": "2026-11-21"
}
```

注意：

- `title`：资料标题。
- `category`：分类名称。现有分类为 `Programming`、`Technology`、`Books`、`Miscellaneous`。也可以自定义新分类。
- `tags`：标签数组，可以有多个。
- `description`：简短描述。
- `file`：相对于网站根目录的文件路径。
- `type`：`pdf`、`html` 或 `link`。
- `date`：添加日期，格式为 `YYYY-MM-DD`。

### 3. 提交更改

上传 PDF 并修改 JSON 后，提交到 `main` 分支。GitHub Pages 会自动重新部署。等部署完成后刷新网站即可。

## 如何添加 HTML 笔记

将 HTML 文件放入 `notes/articles/`，例如：

```text
notes/articles/react-hooks.html
```

然后在 `library.json` 中增加：

```json
{
  "title": "React Hooks 笔记",
  "category": "Programming",
  "tags": ["React", "Hooks"],
  "description": "关于常用 Hooks 的个人整理。",
  "file": "notes/articles/react-hooks.html",
  "type": "html",
  "date": "2026-11-21"
}
```

## 如何添加外部网站链接

```json
{
  "title": "MDN Web Docs",
  "category": "Programming",
  "tags": ["JavaScript", "Web", "Reference"],
  "description": "Web 开发技术文档。",
  "file": "https://developer.mozilla.org/",
  "type": "link",
  "date": "2026-11-21"
}
```

## 搜索说明

当前版本的搜索范围是资料元数据：

- 标题
- 描述
- 分类
- 标签

**不会搜索 PDF 文件正文。** 如果将来需要 PDF 正文全文检索，需要额外提取 PDF 文本并建立搜索索引。

## 重要提醒

- GitHub Pages 发布的内容是公开的。不要上传公司内部资料、个人隐私、受版权限制且不允许公开传播的文件。
- GitHub Pages 适合静态网站和个人资料展示，不是私密网盘或大文件分发服务。
- 仓库、单文件大小和 Pages 带宽等均受 GitHub 限制。上传大量或很大的 PDF 前，请查看 GitHub Pages 官方限制说明：
  https://docs.github.com/en/pages/getting-started-with-github-pages/github-pages-limits
- `#` 是示例条目的占位链接。正式使用时请将 `file` 替换成真实文件路径或 URL。
