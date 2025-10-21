const express = require('express');
const fs = require('fs');
const path = require('path');
const fetch = require('node-fetch');

const app = express();
app.use(express.json());

// 提供静态前端 HTML 文件
app.use(express.static(path.join(__dirname, 'public')));

// 接收并验证 PDF URL
app.post('/save-pdf-url', async (req, res) => {
    const { pdfUrl } = req.body;

    if (!pdfUrl || !/^https?:\/\/.+/.test(pdfUrl)) {
        return res.json({ message: 'URL格式不正确' });
    }

    try {
        // 只请求响应头，节省流量
        const response = await fetch(pdfUrl, { method: 'HEAD' });

        if (!response.ok) {
            return res.json({ message: 'URL无法访问 (' + response.status + ')' });
        }

        const contentType = response.headers.get('content-type');
        if (!contentType || !contentType.includes('pdf')) {
            return res.json({ message: '该URL不是PDF文件' });
        }

        // 保存到服务器
        const filePath = path.join(__dirname, 'urls.txt');
        fs.appendFileSync(filePath, pdfUrl + '\n', 'utf-8');

        return res.json({ message: '保存成功！' });
    } catch (err) {
        console.error(err);
        return res.json({ message: '验证过程中出错' });
    }
});

// Render 或本地启动
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});