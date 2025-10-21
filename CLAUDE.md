# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

This is a Node.js web service that provides PDF URL validation and storage functionality. The service includes a frontend interface for users to submit PDF URLs and a backend API that validates the URLs before storing them.

## Architecture

### Frontend
- **Static HTML/CSS/JavaScript** located in `public/` directory
- Single-page application with form input for PDF URLs
- Fetch-based API communication with backend

### Backend
- **Node.js + Express** server (`server.js`)
- RESTful API endpoint: `POST /save-pdf-url`
- PDF URL validation using HTTP HEAD requests
- File-based storage (`urls.txt`) for validated URLs

## Development Commands

### Local Development
```bash
# Install dependencies
npm install

# Start development server
node server.js

# Server runs on http://localhost:3000
```

### Deployment
```bash
# Render deployment (production)
# Build Command: npm install
# Start Command: node server.js
```

## API Endpoints

### POST /save-pdf-url
Validates and saves PDF URLs to storage.

**Request:**
```json
{
  "pdfUrl": "https://example.com/file.pdf"
}
```

**Response:**
```json
{
  "message": "保存成功！" | "URL格式不正确" | "URL无法访问" | "该URL不是PDF文件"
}
```

## Key Features

1. **URL Format Validation**: Validates basic URL structure using regex
2. **Accessibility Check**: Uses HTTP HEAD requests to verify URL accessibility
3. **Content Type Verification**: Ensures the URL serves PDF content
4. **Persistent Storage**: Saves validated URLs to `urls.txt`
5. **Error Handling**: Comprehensive error handling for network and validation failures

## Dependencies

- `express`: Web framework for API and static file serving
- `node-fetch`: HTTP client for URL validation

## File Structure

```
xhs-services/
├── server.js          # Main Express server
├── package.json       # Dependencies and scripts
├── urls.txt          # Storage for validated PDF URLs
└── public/
    └── index.html    # Frontend interface
```

## Development Notes

- The server uses Express static middleware to serve the frontend from `/public`
- PDF validation is performed asynchronously with proper error handling
- URLs are appended to `urls.txt` with newline separation
- The service is designed to be deployed on Render with environment-based PORT configuration

## Related Projects

This project is part of the xhs (小红书) ecosystem alongside:
- `xhs-agent/`: Python-based automation tools
- `xiaohongshu-mcp/`: Go-based MCP server for 小红书 integration

Both projects use different technology stacks but serve the broader goal of 小红书 content management and automation.