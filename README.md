# 🤖 AI Search API MCP Server

[![npm version](https://badge.fury.io/js/aisearchapi-mcp.svg)](https://www.npmjs.com/package/aisearchapi-mcp)
[![TypeScript](https://img.shields.io/badge/%3C%2F%3E-TypeScript-%230074c1.svg)](http://www.typescriptlang.org/)
[![Node.js](https://img.shields.io/badge/Node.js-18%2B-339933.svg?logo=node.js&logoColor=white)](https://nodejs.org/)

A **Model Context Protocol (MCP) server** that integrates the [AI Search API](https://aisearchapi.io/) into MCP-compatible apps.  
Bring **semantic search, context awareness, and source citations** directly into your AI workflows.

👉 Get started now:  
- [🆕 Sign Up](https://app.aisearchapi.io/join)  
- [🔑 Log In](https://app.aisearchapi.io/login)  
- [📊 Dashboard](https://app.aisearchapi.io/dashboard) (manage your API key)  

---

## ✨ Features

- 🔍 **Intelligent Semantic Search** – Natural language search with embeddings  
- 💬 **Context Management** – Keep or clear conversation history  
- 📝 **Flexible Responses** – Markdown or plain text output  
- 📚 **Source Citations** – Reliable references included  
- 📊 **Balance Monitoring** – Track credits in real time  
- ⚡ **TypeScript Support** – Strong typing & IDE hints  

---

## 📦 Installation

From npm (recommended):  
```bash
npm install -g aisearchapi-mcp
```

From source:  
```bash
git clone https://github.com/aisearchapi/aisearchapi-mcp.git
cd aisearchapi-mcp
npm install
npm run build
```

---

## 🔑 Configuration

### 1. Get API Key  
Create your account and copy your key:  
- [Join](https://app.aisearchapi.io/join) | [Login](https://app.aisearchapi.io/login) | [Dashboard](https://app.aisearchapi.io/dashboard)

### 2. Environment Variables  
`.env` file:  
```env
AISEARCHAPI_KEY=your-api-key-here
AISEARCHAPI_BASE_URL=https://api.aisearchapi.io
AISEARCHAPI_TIMEOUT=30000
AISEARCHAPI_VERBOSE=false
```
---

## 🛠️ Configure Claude for Desktop
First of all, make sure you download claude code:
```bash
npm install -g @anthropic-ai/claude-code
```

Make sure you go through the authorization process in order to get access to Claude Code.

---
After ensuring that **claude-code** is working, this is how you would set up your local mcp:
```bash
claude mcp add aisearchapi "npx -y aisearchapi-mcp" --env API_KEY=<YOUR-API-KEY>
```
After executing this, in order to ensure everything is added correctly, you could just type:
```bash
> claude mcp list                                                                                 
Checking MCP server health...
aisearchapi: npx -y aisearchapi-mcp  - ✓ Connected
```
Now you are ready to go!

---

## 💻 Command Line Usage

List tools:  
```bash
node dist/index.js --list-tools
```

Check balance:  
```bash
node dist/index.js --check-balance
```

Run server:  
```bash
node dist/index.js
```

---

## ⚠️ Error Codes

| Code | Meaning | Fix |
|------|---------|-----|
| 401 | Unauthorized | Invalid key → [Get key](https://app.aisearchapi.io/dashboard) |
| 429 | Too Many Requests | Slow down or add retry logic |
| 433 | Quota Exceeded | Buy credits / upgrade |
| 500 | Server Error | Try again later |
| 503 | Service Unavailable | Temporary downtime |

---

## 🔧 Development

```bash
git clone https://github.com/aisearchapi/aisearchapi-mcp.git
cd aisearchapi-mcp
npm install
npm run build
npm run dev
```

---

## 🛡️ Best Practices

- Clear context when switching topics  
- Use markdown output for richer UI  
- Monitor credits regularly  
- Secure your API key with env vars  

---

## 📚 Resources

- [AI Search API Homepage](https://aisearchapi.io/)  
- [Join](https://app.aisearchapi.io/join) | [Login](https://app.aisearchapi.io/login) | [Dashboard](https://app.aisearchapi.io/dashboard)  
- [Docs](https://docs.aisearchapi.io/)  
- [npm package](https://www.npmjs.com/package/aisearchapi-mcp)  
- [Issues](https://github.com/aisearchapi/aisearchapi-mcp/issues)  
- [Blog Posts](https://aisearchapi.io/blog/)

---

## 🎉 Start Now

```bash
npm install -g aisearchapi-mcp
```
Then configure your Claude Desktop and start searching with **AI Search API MCP Server**.  
---

### 🔍 SEO Keywords  
*AI Search API MCP server, semantic search, context-aware AI MCP, AI Search API Node.js MCP, AI Search API key, MCP integration*
