#!/bin/bash

# 使用 curl 获取 PDF URL 信息
# 使用方法: ./curl-get-urls.sh

if [ -z "$1" ]; then
    echo "🔍 获取 PDF URL 提交信息"
    echo ""
    echo "使用方法:"
    echo "  ./curl-get-urls.sh https://your-app-url.vercel.app"
    echo ""
    echo "示例:"
    echo "  ./curl-get-urls.sh https://xhs-services-abc123.vercel.app"
    exit 1
fi

APP_URL="$1"

echo "📡 正在从 $APP_URL 获取信息..."
echo ""

# 获取 API 响应
echo "📋 API 响应:"
curl -s "$APP_URL/api/urls" | python3 -m json.tool 2>/dev/null || curl -s "$APP_URL/api/urls"

echo ""
echo "💡 其他获取方法:"
echo "1. 浏览器访问: $APP_URL/api/urls"
echo "2. Vercel Dashboard: Functions → Function Logs"
echo "3. Vercel CLI: vercel logs follow"