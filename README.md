# AI Search API MCP Server

A Model Context Protocol (MCP) server that integrates AI Search API capabilities into Claude Desktop and other MCP-compatible applications. This server provides intelligent search functionality with context awareness, semantic understanding, and source citations.

## Features

- **Intelligent Search**: Leverage advanced AI embeddings for semantic search with context awareness
- **Context Management**: Maintain conversation history for contextual searches
- **Multiple Response Formats**: Support for both markdown and plain text responses
- **Source Citations**: Get reliable sources for all search results
- **Balance Monitoring**: Track API usage and remaining credits
- **Full TypeScript Support**: Type-safe implementation with excellent IDE support

## Installation

### From npm

```bash
npm install -g aisearchapi-mcp
```

### From Source

```bash
git clone https://github.com/aisearchapi/aisearchapi-mcp.git
cd aisearchapi-mcp
npm install
npm run build
```

## Configuration

### 1. Get an API Key

Sign up for an API key at [aisearchapi.io](https://aisearchapi.io)

### 2. Set Environment Variables

Create a `.env` file in the project root:

```env
# Required
AISEARCHAPI_KEY=as-dev-your-api-key-here

# Optional
AISEARCHAPI_BASE_URL=https://api.aisearchapi.io
AISEARCHAPI_TIMEOUT=30000
AISEARCHAPI_VERBOSE=false
```

### 3. Configure Claude Desktop

Add the server to your Claude Desktop configuration file:

**macOS**: `~/Library/Application Support/Claude/claude_desktop_config.json`
**Windows**: `%APPDATA%/Claude/claude_desktop_config.json`
**Linux**: `~/.config/claude/claude_desktop_config.json`

#### Global Installation Configuration

```json
{
  "mcpServers": {
    "aisearchapi": {
      "command": "npx",
      "args": ["-y", "aisearchapi-mcp"],
      "env": {
        "AISEARCHAPI_KEY": "as-dev-your-api-key-here"
      }
    }
  }
}
```

#### Local Installation Configuration

```json
{
  "mcpServers": {
    "aisearchapi": {
      "command": "node",
      "args": ["/absolute/path/to/aisearchapi-mcp/dist/index.js"],
      "env": {
        "AISEARCHAPI_KEY": "as-dev-your-api-key-here"
      }
    }
  }
}
```

#### Advanced Configuration with Options

```json
{
  "mcpServers": {
    "aisearchapi": {
      "command": "node",
      "args": ["/path/to/aisearchapi-mcp/dist/index.js"],
      "env": {
        "AISEARCHAPI_KEY": "as-dev-your-api-key-here",
        "AISEARCHAPI_BASE_URL": "https://api.aisearchapi.io",
        "AISEARCHAPI_TIMEOUT": "60000",
        "AISEARCHAPI_VERBOSE": "true"
      }
    }
  }
}
```

## Available Tools

### 1. `aisearch-search`

Performs AI-powered searches with semantic understanding and context awareness.

**Parameters:**
- `prompt` (required): The main search query
- `use_context` (optional): Include conversation history for context
- `additional_context` (optional): Provide explicit context messages
- `response_type` (optional): "markdown" or "text" format
- `include_sources` (optional): Include source URLs in response
- `include_timing` (optional): Include processing time metrics

**Example Usage in Claude:**
```
Use aisearch-search to find information about renewable energy benefits
```

### 2. `aisearch-balance`

Check your AI Search API account balance and available credits.

**Parameters:**
- `format` (optional): "detailed" or "simple" response format

**Example Usage in Claude:**
```
Check my AI Search API balance
```

### 3. `aisearch-clear-context`

Clear the conversation context history when starting new topics.

**Example Usage in Claude:**
```
Clear the search context
```

## Command Line Usage

### List Available Tools

```bash
node dist/index.js --list-tools
```

### Check API Balance

```bash
node dist/index.js --check-balance
```

### Start MCP Server

```bash
node dist/index.js
```

## Usage Examples in Claude

### Basic Search

```
Search for the latest developments in quantum computing using aisearch
```

### Contextual Search

```
Use aisearch to find information about solar panels. I'm interested in residential installations and cost effectiveness.
```

### Search with Previous Context

```
Now search for installation requirements, using the context from our previous discussion
```

### Check Balance

```
What's my current AI Search API balance?
```

## Environment Variables

| Variable | Description | Default | Required |
|----------|-------------|---------|----------|
| `AISEARCHAPI_KEY` | Your AI Search API key | - | Yes |
| `AISEARCHAPI_BASE_URL` | API base URL | `https://api.aisearchapi.io` | No |
| `AISEARCHAPI_TIMEOUT` | Request timeout in milliseconds | `30000` | No |
| `AISEARCHAPI_VERBOSE` | Enable verbose logging | `false` | No |

## Development

### Building from Source

```bash
# Clone the repository
git clone https://github.com/aisearchapi/aisearchapi-mcp.git
cd aisearchapi-mcp

# Install dependencies
npm install

# Build the project
npm run build

# Run in development mode
npm run dev
```

### Project Structure

```
aisearchapi-mcp/
├── src/
│   └── index.ts          # Main server implementation
├── dist/                 # Compiled JavaScript (generated)
├── package.json
├── tsconfig.json
├── README.md
├── .env.example
└── LICENSE
```

### Testing Locally

1. Build the project:
   ```bash
   npm run build
   ```

2. Test with stdio:
   ```bash
   echo '{"jsonrpc":"2.0","method":"tools/list","id":1}' | node dist/index.js
   ```

3. Test specific tools:
   ```bash
   node dist/index.js --list-tools
   node dist/index.js --check-balance
   ```

## Error Handling

The server provides detailed error messages for common issues:

- **Invalid API Key**: Check your `AISEARCHAPI_KEY` environment variable
- **Rate Limiting**: The server respects API rate limits
- **Timeout Errors**: Adjust `AISEARCHAPI_TIMEOUT` if needed
- **Low Balance**: Warnings when credits are running low

## Troubleshooting

### Server Not Starting

1. Verify API key is set:
   ```bash
   echo $AISEARCHAPI_KEY
   ```

2. Check Node.js version (requires 18+):
   ```bash
   node --version
   ```

3. Ensure proper build:
   ```bash
   npm run clean
   npm run build
   ```

### Claude Desktop Not Finding Server

1. Verify configuration file location
2. Use absolute paths in configuration
3. Restart Claude Desktop after config changes
4. Check Claude Desktop logs for errors

### API Errors

- **401 Unauthorized**: Invalid API key
- **429 Too Many Requests**: Rate limit exceeded
- **433 Quota Exceeded**: Account credits depleted

## Best Practices

1. **Context Management**: Clear context when switching topics to avoid confusion
2. **Response Format**: Use markdown for rich formatting, text for plain output
3. **Balance Monitoring**: Check balance regularly to avoid service interruption
4. **Error Recovery**: The server includes automatic retry logic for transient failures

## Security Considerations

- Never commit your API key to version control
- Use environment variables for sensitive configuration
- Rotate API keys regularly
- Monitor usage for unusual activity

## Contributing

Contributions are welcome! Please feel free to submit issues and pull requests.

1. Fork the repository
2. Create your feature branch
3. Commit your changes
4. Push to the branch
5. Open a pull request

## License

MIT License - see [LICENSE](LICENSE) file for details

## Support

- **Email**: admin@aisearchapi.io
- **Documentation**: [docs.aisearchapi.io](https://docs.aisearchapi.io)
- **Issues**: [GitHub Issues](https://github.com/aisearchapi/aisearchapi-mcp/issues)

## Related Projects

- [AI Search API Client](https://github.com/aisearchapi/aisearchapi-js)
- [Model Context Protocol](https://github.com/anthropics/model-context-protocol)

## Changelog

### Version 1.0.0
- Initial release with search, balance, and context management tools
- Full TypeScript support
- Comprehensive error handling
- Context-aware searching capabilities