// Vercel Serverless Function with File Storage
const fetch = require('node-fetch');
const fs = require('fs');
const path = require('path');

// 文件路径 - 使用 Vercel 的 /tmp 目录
const URLS_FILE = '/tmp/saved_urls.txt';

// 读取已保存的 URL
function getSavedUrls() {
    try {
        if (fs.existsSync(URLS_FILE)) {
            const content = fs.readFileSync(URLS_FILE, 'utf-8');
            return content.split('\n').filter(url => url.trim() !== '');
        }
    } catch (error) {
        console.error('读取文件失败:', error);
    }
    return [];
}

// 保存 URL 到文件
function saveUrl(url) {
    try {
        const existingUrls = getSavedUrls();
        if (!existingUrls.includes(url)) {
            fs.appendFileSync(URLS_FILE, url + '\n', 'utf-8');
            console.log('URL 已保存到文件:', url);
        }
        return true;
    } catch (error) {
        console.error('保存文件失败:', error);
        return false;
    }
}

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
            const savedUrls = getSavedUrls();
            return res.json({
                message: "保存的 PDF URL 列表",
                urls: savedUrls,
                count: savedUrls.length,
                note: "URL 保存到 /tmp/saved_urls.txt 文件中。注意：Vercel Serverless 环境中，文件可能在冷启动时丢失。"
            });
        }

        // 返回前端页面
        return res.status(200).generateHtml(`
<!DOCTYPE html>
<html lang="zh">
<head>
<meta charset="UTF-8">
<title>PDF URL 保存示例</title>
<style>
    body { font-family: Arial, sans-serif; max-width: 800px; margin: 0 auto; padding: 20px; background-color: #f5f5f5; }
    .container { background: white; padding: 30px; border-radius: 8px; box-shadow: 0 2px 10px rgba(0,0,0,0.1); }
    h1 { color: #333; text-align: center; margin-bottom: 30px; }
    .input-group { display: flex; gap: 10px; margin-bottom: 20px; }
    input[type="text"] { flex: 1; padding: 12px; border: 2px solid #ddd; border-radius: 4px; font-size: 16px; }
    button { padding: 12px 24px; color: white; border: none; border-radius: 4px; cursor: pointer; font-size: 16px; }
    #sendBtn { background-color: #007bff; }
    #viewBtn { background-color: #28a745; }
    button:hover { opacity: 0.8; }
    button:disabled { background-color: #ccc; cursor: not-allowed; }
    #result, #savedUrls { margin-top: 20px; padding: 15px; border-radius: 4px; font-weight: bold; }
    .success { background-color: #d4edda; color: #155724; }
    .error { background-color: #f8d7da; color: #721c24; }
    .loading { background-color: #fff3cd; color: #856404; }
</style>
</head>
<body>
<div class="container">
    <h1>PDF URL 保存服务</h1>
    <p>请输入您想要保存的 PDF 文件链接，系统将验证该链接的有效性并保存。</p>

    <div class="input-group">
        <input type="text" id="pdfUrl" placeholder="https://arxiv.org/pdf/2508.21058 或其他 PDF 链接">
        <button id="sendBtn">发送</button>
    </div>

    <div class="input-group">
        <button id="viewBtn">查看已保存的 URL</button>
    </div>

    <div id="result"></div>
    <div id="savedUrls"></div>
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

        if (data.message.includes('成功')) {
            resultDiv.className = 'success';
            document.getElementById('pdfUrl').value = '';
        } else {
            resultDiv.className = 'error';
        }
    } catch (err) {
        console.error(err);
        resultDiv.textContent = '请求失败，请稍后再试';
        resultDiv.className = 'error';
    } finally {
        sendBtn.disabled = false;
        sendBtn.textContent = '发送';
    }
});

document.getElementById('viewBtn').addEventListener('click', async () => {
    const savedUrlsDiv = document.getElementById('savedUrls');
    const viewBtn = document.getElementById('viewBtn');

    viewBtn.disabled = true;
    viewBtn.textContent = '加载中...';

    try {
        const response = await fetch('/api/urls');
        const data = await response.json();

        if (data.urls && data.urls.length > 0) {
            let html = '<div style="background-color: #f8f9fa; padding: 15px; border-radius: 4px; border: 1px solid #dee2e6;">';
            html += '<h3 style="margin-top: 0;">已保存的 PDF URL (' + data.count + ' 个)</h3>';
            html += '<ul style="margin: 0; padding-left: 20px;">';

            data.urls.forEach((url) => {
                html += '<li style="margin-bottom: 8px;">';
                html += '<a href="' + url + '" target="_blank" style="color: #007bff; text-decoration: none;">' + url + '</a>';
                html += ' <button onclick="copyToClipboard(\'' + url + '\')" style="margin-left: 10px; padding: 2px 8px; font-size: 12px; background-color: #17a2b8; color: white; border: none; border-radius: 3px; cursor: pointer;">复制</button>';
                html += '</li>';
            });

            html += '</ul>';
            html += '<p style="margin: 10px 0 0 0; font-size: 14px; color: #6c757d;">' + data.note + '</p>';
            html += '</div>';

            savedUrlsDiv.innerHTML = html;
        } else {
            savedUrlsDiv.innerHTML = '<div style="background-color: #fff3cd; padding: 15px; border-radius: 4px; color: #856404;">暂无保存的 URL</div>';
        }
    } catch (err) {
        console.error(err);
        savedUrlsDiv.innerHTML = '<div style="background-color: #f8d7da; padding: 15px; border-radius: 4px; color: #721c24;">获取保存的 URL 失败</div>';
    } finally {
        viewBtn.disabled = false;
        viewBtn.textContent = '查看已保存的 URL';
    }
});

function copyToClipboard(text) {
    navigator.clipboard.writeText(text).then(() => {
        const originalText = event.target.textContent;
        event.target.textContent = '已复制!';
        event.target.style.backgroundColor = '#28a745';
        setTimeout(() => {
            event.target.textContent = originalText;
            event.target.style.backgroundColor = '#17a2b8';
        }, 1500);
    });
}

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

            const response = await fetch(pdfUrl, {
                method: 'HEAD',
                timeout: 30000,
                headers: {
                    'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
                }
            });

            console.log('响应状态:', response.status);

            if (!response.ok) {
                return res.json({ message: 'URL无法访问 (' + response.status + ')' });
            }

            const contentType = response.headers.get('content-type');
            console.log('Content-Type:', contentType);

            if (!contentType || !contentType.toLowerCase().includes('pdf')) {
                return res.json({ message: '该URL不是PDF文件，检测到的类型: ' + (contentType || '未知') });
            }

            // 保存到文件
            const saved = saveUrl(pdfUrl);
            if (saved) {
                console.log('✅ PDF URL 验证成功并已保存:', pdfUrl);
                return res.json({ message: '保存成功！PDF URL 已验证并保存到文件。' });
            } else {
                return res.json({ message: '验证成功但保存失败，请稍后重试。' });
            }

        } catch (error) {
            console.error('详细错误信息:', error);

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