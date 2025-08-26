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

## 🛠️ Available Tools

### `aisearch-search`  
Perform contextual semantic searches.  
```bash
Use aisearch-search to find renewable energy benefits
```

### `aisearch-balance`  
Check credits and balance.  
```bash
Check my AI Search API balance
```

### `aisearch-clear-context`  
Clear stored conversation history.  
```bash
Clear the search context
```

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

Test locally:  
```bash
echo '{"jsonrpc":"2.0","method":"tools/list","id":1}' | node dist/index.js
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

---

## 🎉 Start Now

```bash
npm install -g aisearchapi-mcp
```
Then configure your inspector and start searching with **AI Search API MCP Server**.  
---

### 🔍 SEO Keywords  
*AI Search API MCP server, semantic search, context-aware AI MCP, AI Search API Node.js MCP, AI Search API key, MCP integration*
