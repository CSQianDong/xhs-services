# XHS Services - PDF URL 验证服务

一个简单的 PDF URL 验证和存储服务，可以验证 PDF 链接的有效性并将验证通过的 URL 保存到服务器。

## 功能特性

- ✅ PDF URL 格式验证
- ✅ URL 可访问性检查
- ✅ PDF 内容类型验证
- ✅ 验证成功后自动保存到文件
- ✅ 美观的 Web 界面
- ✅ RESTful API 接口

## 本地开发

### 环境要求
- Node.js 14+
- npm

### 安装和运行

```bash
# 克隆项目
git clone <your-repo-url>
cd xhs-services

# 安装依赖
npm install

# 启动服务
npm start
```

访问 http://localhost:3000 使用 Web 界面，或调用 API：

```bash
curl -X POST http://localhost:3000/save-pdf-url \
  -H "Content-Type: application/json" \
  -d '{"pdfUrl": "https://arxiv.org/pdf/2508.21058"}'
```

## 部署到 Render

### 方法一：使用 render.yaml（推荐）

1. **Fork 项目到你的 GitHub 账户**

2. **访问 [Render Dashboard](https://dashboard.render.com/)**

3. **点击 "New +" → "Web Service"**

4. **连接你的 GitHub 仓库**

5. **Render 会自动检测 render.yaml 配置文件**
   - 构建命令：`npm install`
   - 启动命令：`node server.js`
   - 环境：Node.js

6. **选择 Free 计划**

7. **点击 "Create Web Service"**

### 方法二：手动配置

如果你不使用 render.yaml，可以手动配置：

1. **连接 GitHub 仓库到 Render**

2. **配置构建和启动命令：**
   - **Build Command**: `npm install`
   - **Start Command**: `node server.js`

3. **环境变量：**
   - `NODE_ENV`: `production`

4. **选择 Free 计划并部署**

### 部署完成后

1. **等待构建完成**（通常需要 2-3 分钟）

2. **获取部署 URL**，格式类似：`https://xhs-services.onrender.com`

3. **测试服务是否正常工作**

## API 文档

### POST /save-pdf-url

验证并保存 PDF URL。

**请求体：**
```json
{
  "pdfUrl": "https://example.com/file.pdf"
}
```

**响应：**
```json
{
  "message": "保存成功！" | "URL格式不正确" | "URL无法访问" | "该URL不是PDF文件"
}
```

### GET /

返回前端 HTML 页面。

## 项目结构

```
xhs-services/
├── public/
│   └── index.html      # 前端界面
├── server.js           # Express 服务器
├── package.json        # 项目配置
├── render.yaml         # Render 部署配置
├── urls.txt           # PDF URL 存储文件
├── CLAUDE.md          # Claude Code 文档
├── README.md          # 项目说明
└── .gitignore         # Git 忽略文件
```

## 注意事项

1. **URL 验证**：系统会检查 URL 是否返回 PDF 内容类型
2. **存储限制**：当前使用文件存储，适合小规模使用
3. **免费计划限制**：Render 免费计划有资源限制，适合测试和小规模使用
4. **网络超时**：PDF 验证可能需要几秒钟时间

## 故障排除

### 常见问题

1. **部署失败**：
   - 检查 `package.json` 是否正确
   - 确保 `server.js` 可以正常启动

2. **API 调用失败**：
   - 检查 URL 格式是否正确
   - 确认目标 URL 可以访问

3. **界面无法访问**：
   - 等待部署完成
   - 检查 Render 日志

### 查看日志

在 Render Dashboard 中：
1. 进入你的服务
2. 点击 "Logs" 标签
3. 查看实时日志和错误信息

## 开发和贡献

欢迎提交 Issue 和 Pull Request！

## 许可证

MIT License