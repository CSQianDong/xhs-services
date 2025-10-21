// Vercel Serverless Function
const fetch = require('node-fetch');

// Vercel serverless function handler
module.exports = async (req, res) => {
    // 处理 CORS
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

    if (req.method === 'OPTIONS') {
        return res.status(200).end();
    }

    if (req.method === 'GET') {
        // 如果是 API 请求，返回保存的 URL 列表
        if (req.url === '/api/urls') {
            // 返回示例 URL（在真实环境中，这些可以通过 console.log 查看）
            return res.json({
                message: "保存的 PDF URL 列表",
                urls: [
                    "请查看 Vercel Dashboard 的 Function Logs 获取所有提交的 URL"
                ],
                count: 1,
                note: "在 Vercel 环境中，所有验证成功的 URL 都通过 console.log 记录。请在 Vercel Dashboard → Functions → Function Logs 中查看完整的 URL 列表。"
            });
        }

        // 返回前端页面（对于 Vercel，静态文件会自动处理）
        return res.status(200).send(`
<!DOCTYPE html>
<html lang="zh">
<head>
<meta charset="UTF-8">
<title>PDF URL 保存示例</title>
<style>
    body {
        font-family: Arial, sans-serif;
        max-width: 800px;
        margin: 0 auto;
        padding: 20px;
        background-color: #f5f5f5;
    }
    .container {
        background: white;
        padding: 30px;
        border-radius: 8px;
        box-shadow: 0 2px 10px rgba(0,0,0,0.1);
    }
    h1 {
        color: #333;
        text-align: center;
        margin-bottom: 30px;
    }
    .input-group {
        display: flex;
        gap: 10px;
        margin-bottom: 20px;
    }
    input[type="text"] {
        flex: 1;
        padding: 12px;
        border: 2px solid #ddd;
        border-radius: 4px;
        font-size: 16px;
    }
    input[type="text"]:focus {
        outline: none;
        border-color: #007bff;
    }
    button {
        padding: 12px 24px;
        background-color: #007bff;
        color: white;
        border: none;
        border-radius: 4px;
        cursor: pointer;
        font-size: 16px;
        transition: background-color 0.3s;
    }
    button:hover {
        background-color: #0056b3;
    }
    button:disabled {
        background-color: #ccc;
        cursor: not-allowed;
    }
    #result {
        margin-top: 20px;
        padding: 15px;
        border-radius: 4px;
        font-weight: bold;
    }
    .success {
        background-color: #d4edda;
        color: #155724;
        border: 1px solid #c3e6cb;
    }
    .error {
        background-color: #f8d7da;
        color: #721c24;
        border: 1px solid #f5c6cb;
    }
    .info {
        background-color: #d1ecf1;
        color: #0c5460;
        border: 1px solid #bee5eb;
    }
    .loading {
        background-color: #fff3cd;
        color: #856404;
        border: 1px solid #ffeaa7;
    }
</style>
</head>
<body>
<div class="container">
    <h1>PDF URL 保存服务</h1>
    <p>请输入您想要保存的 PDF 文件链接，系统将验证该链接的有效性并保存。</p>

    <div class="input-group">
        <input type="text" id="pdfUrl" size="80" placeholder="https://arxiv.org/pdf/2508.21058 或其他 PDF 链接">
        <button id="sendBtn">发送</button>
    </div>

    <div class="input-group">
        <button id="viewBtn" style="background-color: #28a745;">查看提交记录</button>
    </div>

    <div id="result"></div>
    <div id="savedUrls" style="margin-top: 20px;"></div>
</div>

<script>
document.getElementById('sendBtn').addEventListener('click', async () => {
    const url = document.getElementById('pdfUrl').value.trim();
    const resultDiv = document.getElementById('result');
    const sendBtn = document.getElementById('sendBtn');

    if (!url) {
        resultDiv.textContent = '请输入 URL';
        resultDiv.className = 'error';
        return;
    }

    // 显示加载状态
    sendBtn.disabled = true;
    sendBtn.textContent = '验证中...';
    resultDiv.textContent = '正在验证 PDF 链接，请稍候...';
    resultDiv.className = 'loading';

    try {
        const response = await fetch('/', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ pdfUrl: url })
        });

        const data = await response.json();
        resultDiv.textContent = data.message;

        // 根据返回消息设置样式
        if (data.message.includes('成功')) {
            resultDiv.className = 'success';
            // 清空输入框
            document.getElementById('pdfUrl').value = '';
        } else {
            resultDiv.className = 'error';
        }
    } catch (err) {
        console.error(err);
        resultDiv.textContent = '请求失败，请稍后再试';
        resultDiv.className = 'error';
    } finally {
        // 恢复按钮状态
        sendBtn.disabled = false;
        sendBtn.textContent = '发送';
    }
});

// 查看提交记录
document.getElementById('viewBtn').addEventListener('click', async () => {
    const savedUrlsDiv = document.getElementById('savedUrls');
    const viewBtn = document.getElementById('viewBtn');

    viewBtn.disabled = true;
    viewBtn.textContent = '加载中...';

    try {
        const response = await fetch('/api/urls');
        const data = await response.json();

        let html = '<div style="background-color: #f8f9fa; padding: 15px; border-radius: 4px; border: 1px solid #dee2e6;">';
        html += '<h3 style="margin-top: 0; color: #495057;">如何查看保存的 URL</h3>';
        html += '<p style="margin: 10px 0;">' + data.note + '</p>';
        html += '<div style="background-color: #e7f3ff; padding: 10px; border-radius: 4px; margin-top: 10px;">';
        html += '<strong>查看步骤：</strong><br>';
        html += '1. 访问 <a href="https://vercel.com/dashboard" target="_blank" style="color: #007bff;">Vercel Dashboard</a><br>';
        html += '2. 找到你的 xhs-services 项目<br>';
        html += '3. 点击 "Functions" 标签<br>';
        html += '4. 查看 "Function Logs" 中的所有提交记录<br>';
        html += '5. 搜索 "✅ PDF URL 验证成功" 找到所有成功保存的 URL';
        html += '</div>';
        html += '</div>';

        savedUrlsDiv.innerHTML = html;
    } catch (err) {
        console.error(err);
        savedUrlsDiv.innerHTML = '<div style="background-color: #f8d7da; padding: 15px; border-radius: 4px; border: 1px solid #f5c6cb; color: #721c24;">获取信息失败，请稍后再试</div>';
    } finally {
        viewBtn.disabled = false;
        viewBtn.textContent = '查看提交记录';
    }
});

// 支持 Enter 键提交
document.getElementById('pdfUrl').addEventListener('keypress', (e) => {
    if (e.key === 'Enter') {
        document.getElementById('sendBtn').click();
    }
});
</script>
</body>
</html>
        `);
    }

    if (req.method === 'POST') {
        try {
            const { pdfUrl } = req.body;

            if (!pdfUrl || !/^https?:\/\/.+/.test(pdfUrl)) {
                return res.json({ message: 'URL格式不正确' });
            }

            console.log('开始验证 PDF URL:', pdfUrl);

            // 使用更兼容的 fetch 配置
            const response = await fetch(pdfUrl, {
                method: 'HEAD',
                timeout: 30000, // 30秒超时
                headers: {
                    'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
                }
            });

            console.log('响应状态:', response.status);
            console.log('响应头:', response.headers.raw());

            if (!response.ok) {
                return res.json({ message: 'URL无法访问 (' + response.status + ')' });
            }

            const contentType = response.headers.get('content-type');
            console.log('Content-Type:', contentType);

            if (!contentType || !contentType.toLowerCase().includes('pdf')) {
                return res.json({ message: '该URL不是PDF文件，检测到的类型: ' + (contentType || '未知') });
            }

            // Vercel 环境下使用 console.log 记录而不是文件写入
            console.log('✅ PDF URL 验证成功:', pdfUrl);

            return res.json({ message: '保存成功！PDF URL 已验证并记录。' });

        } catch (error) {
            console.error('详细错误信息:', error);

            // 提供更详细的错误信息
            let errorMessage = '验证过程中出错';
            if (error.code === 'ENOTFOUND') {
                errorMessage = '域名解析失败，请检查 URL 是否正确';
            } else if (error.code === 'ECONNREFUSED') {
                errorMessage = '连接被拒绝，请检查目标服务器是否可达';
            } else if (error.code === 'ETIMEDOUT') {
                errorMessage = '请求超时，请检查网络连接或稍后重试';
            } else if (error.message) {
                errorMessage = '验证失败: ' + error.message;
            }

            return res.json({ message: errorMessage });
        }
    }

    return res.status(405).json({ message: 'Method not allowed' });
};