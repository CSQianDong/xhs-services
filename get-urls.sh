#!/bin/bash

# 获取 Vercel 应用中的 PDF URL
# 使用方法: ./get-urls.sh

echo "🔍 正在获取提交的 PDF URL..."
echo ""

# 检查是否安装了 jq
if ! command -v jq &> /dev/null; then
    echo "⚠️  需要安装 jq 来解析 JSON"
    echo "MacOS: brew install jq"
    echo "Ubuntu: sudo apt-get install jq"
    exit 1
fi

# 获取你的 Vercel 项目 URL（请替换为你的实际 URL）
APP_URL="https://your-app-url.vercel.app"

if [ -z "$1" ]; then
    echo "请提供你的 Vercel 应用 URL:"
    echo "使用方法: ./get-urls.sh https://your-app-url.vercel.app"
    exit 1
fi

APP_URL="$1"

echo "📡 从 $APP_URL/api/urls 获取信息..."
echo ""

# 调用 API 获取信息
response=$(curl -s "$APP_URL/api/urls")

echo "📋 响应信息:"
echo "$response" | jq '.'

echo ""
echo "💡 提示:"
echo "1. 要查看完整的 URL 列表，请访问 Vercel Dashboard"
echo "2. 在 Functions → Function Logs 中搜索 '✅ PDF URL 验证成功'"
echo "3. 或者使用 Vercel CLI: vercel logs follow"