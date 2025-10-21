#!/usr/bin/env python3
"""
获取 Vercel 应用中提交的 PDF URL
使用方法: python3 get_urls.py https://your-app-url.vercel.app
"""

import sys
import json
import requests
from datetime import datetime

def get_pdf_urls(app_url):
    """获取 PDF URL 列表"""
    try:
        api_url = f"{app_url}/api/urls"
        response = requests.get(api_url, timeout=10)
        response.raise_for_status()

        data = response.json()

        print(f"📊 PDF URL 提交信息")
        print(f"🕐 获取时间: {datetime.now().strftime('%Y-%m-%d %H:%M:%S')}")
        print(f"🌐 应用地址: {app_url}")
        print("-" * 50)

        print(f"📝 消息: {data.get('message', 'N/A')}")
        print(f"🔢 数量: {data.get('count', 0)}")
        print(f"📋 说明: {data.get('note', 'N/A')}")

        if data.get('urls'):
            print("\n📄 URL 列表:")
            for i, url in enumerate(data['urls'], 1):
                print(f"  {i}. {url}")

        print("\n💡 更多信息:")
        print("  - 所有成功验证的 URL 都记录在 Vercel Function Logs 中")
        print("  - 请在 Vercel Dashboard 搜索 '✅ PDF URL 验证成功'")

    except requests.exceptions.RequestException as e:
        print(f"❌ 请求失败: {e}")
    except json.JSONDecodeError as e:
        print(f"❌ JSON 解析失败: {e}")
    except Exception as e:
        print(f"❌ 发生错误: {e}")

if __name__ == "__main__":
    if len(sys.argv) != 2:
        print("使用方法: python3 get_urls.py https://your-app-url.vercel.app")
        print("示例: python3 get_urls.py https://xhs-services-abc123.vercel.app")
        sys.exit(1)

    app_url = sys.argv[1]
    get_pdf_urls(app_url)