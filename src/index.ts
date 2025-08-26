#!/usr/bin/env node

import { Server } from "@modelcontextprotocol/sdk/server/index.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import {
  CallToolRequestSchema,
  ListToolsRequestSchema,
  Tool
} from "@modelcontextprotocol/sdk/types.js";
import { McpError, ErrorCode } from "@modelcontextprotocol/sdk/types.js";
import { AISearchAPIClient } from "aisearchapi-client";
import dotenv from "dotenv";
import yargs from 'yargs';
import { hideBin } from 'yargs/helpers';

dotenv.config();

const API_KEY = process.env.AISEARCHAPI_KEY;
if (!API_KEY) {
  throw new Error("AISEARCHAPI_KEY environment variable is required");
}

interface AISearchMCPResponse {
  answer: string;
  sources: string[];
  response_type: string;
  total_time: number;
}

interface AISearchBalanceResponse {
  available_credits: number;
}

interface Arguments {
  'list-tools': boolean;
  'check-balance': boolean;
  _: (string | number)[];
  $0: string;
}

class AISearchMCPServer {
  private server: Server;
  private apiClient: AISearchAPIClient;
  private conversationContext: Array<{ role: 'user', content: string }> = [];
  private maxContextSize: number = 10; // Keep last 10 messages for context

  constructor() {
    this.server = new Server(
      {
        name: "aisearchapi-mcp",
        version: "1.0.0",
      },
      {
        capabilities: {
          tools: {},
        },
      }
    );

    this.apiClient = new AISearchAPIClient({
      apiKey: API_KEY ?? 'your-api-key',
      baseUrl: process.env.AISEARCHAPI_BASE_URL,
      timeout: parseInt(process.env.AISEARCHAPI_TIMEOUT || "30000")
    });

    this.setupHandlers();
    this.setupErrorHandling();
  }

  private setupErrorHandling(): void {
    this.server.onerror = (error) => {
      console.error("[MCP Error]", error);
    };

    process.on('SIGINT', async () => {
      await this.server.close();
      process.exit(0);
    });

    process.on('uncaughtException', (error) => {
      console.error('Uncaught Exception:', error);
      process.exit(1);
    });
  }

  private setupHandlers(): void {
    this.setupToolHandlers();
  }

  private setupToolHandlers(): void {
    this.server.setRequestHandler(ListToolsRequestSchema, async () => {
      const tools: Tool[] = [
        {
          name: "aisearch-search",
          description: "A powerful AI-powered search tool that provides intelligent responses with context awareness and semantic understanding. Returns comprehensive answers with source citations, processing time metrics, and support for both markdown and plain text formats. Ideal for research, documentation lookup, and complex question answering.",
          inputSchema: {
            type: "object",
            properties: {
              prompt: { 
                type: "string", 
                description: "The main search query that drives the embedding process. This content is parsed and transformed into vector representations for similarity matching and retrieval."
              },
              use_context: {
                type: "boolean",
                description: "Whether to include conversation history as context for better understanding. When true, uses the last few messages to provide contextual awareness.",
                default: false
              },
              additional_context: {
                type: "array",
                items: {
                  type: "object",
                  properties: {
                    role: { 
                      type: "string", 
                      enum: ["user"],
                      description: "The role of the message sender (currently only 'user' is supported)"
                    },
                    content: { 
                      type: "string",
                      description: "The content of the message that helps provide context to the LLM"
                    }
                  },
                  required: ["role", "content"]
                },
                description: "Optional additional conversation context to enhance the model's understanding. An ordered list of messages that influence the final response."
              },
              response_type: {
                type: "string",
                enum: ["text", "markdown"],
                description: "Response format preference. 'markdown' returns rich formatted text with styling (default), 'text' returns plain text without formatting.",
                default: "markdown"
              },
              include_sources: {
                type: "boolean",
                description: "Whether to include source URLs in the response",
                default: true
              },
              include_timing: {
                type: "boolean",
                description: "Whether to include processing time information in the response",
                default: false
              }
            },
            required: ["prompt"]
          }
        },
        {
          name: "aisearch-balance",
          description: "Check your current AI Search API account balance and available credits. Useful for monitoring API usage and ensuring sufficient credits are available for operations.",
          inputSchema: {
            type: "object",
            properties: {
              format: {
                type: "string",
                enum: ["detailed", "simple"],
                description: "Format of the balance response. 'detailed' includes usage recommendations, 'simple' just shows the number.",
                default: "detailed"
              }
            }
          }
        },
        {
          name: "aisearch-clear-context",
          description: "Clear the conversation context history. Useful when starting a new topic or when context is no longer relevant.",
          inputSchema: {
            type: "object",
            properties: {}
          }
        }
      ];
      return { tools };
    });

    this.server.setRequestHandler(CallToolRequestSchema, async (request) => {
      try {
        const args = request.params.arguments ?? {};

        switch (request.params.name) {
          case "aisearch-search":
            return await this.handleSearch(args);
          
          case "aisearch-balance":
            return await this.handleBalance(args);

          case "aisearch-clear-context":
            return this.handleClearContext();

          default:
            throw new McpError(
              ErrorCode.MethodNotFound,
              `Unknown tool: ${request.params.name}`
            );
        }
      } catch (error: any) {
        // Handle API-specific errors
        if (error.name === 'AISearchAPIError') {
          return {
            content: [{
              type: "text",
              text: `AI Search API Error: ${error.message}\nStatus: ${error.statusCode || 'Unknown'}`
            }],
            isError: true,
          };
        }
        
        // Re-throw MCP errors
        if (error instanceof McpError) {
          throw error;
        }

        // Handle other errors
        return {
          content: [{
            type: "text",
            text: `Error: ${error.message || 'An unexpected error occurred'}`
          }],
          isError: true,
        };
      }
    });
  }

  private async handleSearch(args: any): Promise<any> {
    try {
      // Build context array
      let context: string | any[] | undefined = [];
      
      // Add conversation context if requested
      if (args.use_context && this.conversationContext.length > 0) {
        context = [...this.conversationContext];
      }
      
      // Add any additional context provided
      if (args.additional_context && Array.isArray(args.additional_context)) {
        context = [...context, ...args.additional_context];
      }

      // Perform the search
      const response = await this.apiClient.search({
        prompt: args.prompt,
        context: context.length > 0 ? context : undefined,
        response_type: args.response_type || 'markdown'
      });

      // Store this query in context for future use
      this.addToContext(args.prompt);

      // Format the response
      const formattedResponse = this.formatSearchResponse(
        response,
        args.include_sources !== false,
        args.include_timing === true
      );

      return {
        content: [{
          type: "text",
          text: formattedResponse
        }]
      };
    } catch (error) {
      throw error;
    }
  }

  private async handleBalance(args: any): Promise<any> {
    try {
      const response = await this.apiClient.balance();
      
      let formattedResponse: string;
      
      if (args.format === 'simple') {
        formattedResponse = `Available Credits: ${response.available_credits}`;
      } else {
        formattedResponse = this.formatBalanceResponse(response);
      }

      return {
        content: [{
          type: "text",
          text: formattedResponse
        }]
      };
    } catch (error) {
      throw error;
    }
  }

  private handleClearContext(): any {
    const previousSize = this.conversationContext.length;
    this.conversationContext = [];
    
    return {
      content: [{
        type: "text",
        text: `Context cleared successfully. Removed ${previousSize} message(s) from conversation history.`
      }]
    };
  }

  private addToContext(content: string): void {
    this.conversationContext.push({
      role: 'user',
      content: content
    });

    // Keep only the last N messages
    if (this.conversationContext.length > this.maxContextSize) {
      this.conversationContext = this.conversationContext.slice(-this.maxContextSize);
    }
  }

  private formatSearchResponse(
    response: AISearchMCPResponse,
    includeSources: boolean,
    includeTiming: boolean
  ): string {
    const output: string[] = [];

    // Main answer
    output.push(response.answer);

    // Add sources if requested
    if (includeSources && response.sources && response.sources.length > 0) {
      output.push('\n---\n**Sources:**');
      response.sources.forEach((source, index) => {
        output.push(`${index + 1}. ${source}`);
      });
    }

    // Add timing information if requested
    if (includeTiming) {
      output.push(`\n---\n*Processing time: ${response.total_time}ms*`);
    }

    return output.join('\n');
  }

  private formatBalanceResponse(response: AISearchBalanceResponse): string {
    const output: string[] = [];
    
    output.push('**AI Search API Account Balance**\n');
    output.push(`Available Credits: **${response.available_credits}**`);
    
    // Add usage recommendations based on credit level
    if (response.available_credits < 10) {
      output.push('\n⚠️ **Warning:** Low credit balance! Consider adding more credits soon.');
    } else if (response.available_credits < 50) {
      output.push('\n📊 Credit level is moderate. Monitor usage to avoid interruption.');
    } else {
      output.push('\n✅ Credit balance is healthy.');
    }

    // Add estimated usage info
    output.push('\n---');
    output.push('**Estimated Usage:**');
    output.push(`• Basic searches: ~${response.available_credits} queries`);
    output.push(`• Complex searches with context: ~${Math.floor(response.available_credits * 0.5)} queries`);

    return output.join('\n');
  }

  async checkBalance(): Promise<void> {
    try {
      const balance = await this.apiClient.balance();
      console.log(`\nAI Search API Balance: ${balance.available_credits} credits`);
      
      if (balance.available_credits < 10) {
        console.log('⚠️  Warning: Low credit balance!');
      }
    } catch (error: any) {
      console.error('Failed to check balance:', error.message);
    }
  }

  async run(): Promise<void> {
    const transport = new StdioServerTransport();
    await this.server.connect(transport);
    console.error("AI Search API MCP server running on stdio");
    
    // Log current balance on startup if in verbose mode
    if (process.env.AISEARCHAPI_VERBOSE === 'true') {
      await this.checkBalance();
    }
  }
}

function listTools(): void {
  const tools = [
    {
      name: "aisearch-search",
      description: "Performs AI-powered searches with semantic understanding and context awareness. Features include markdown/text formatting, conversation context integration, source citations, and processing time metrics. Perfect for research, documentation lookup, and complex question answering."
    },
    {
      name: "aisearch-balance",
      description: "Checks your AI Search API account balance and available credits. Provides detailed or simple format options with usage recommendations and estimated remaining queries based on current credit level."
    },
    {
      name: "aisearch-clear-context",
      description: "Clears the conversation context history. Useful when switching topics or when previous context is no longer relevant for new searches."
    }
  ];

  console.log("Available AI Search API MCP Tools:\n");
  tools.forEach(tool => {
    console.log(`📌 ${tool.name}`);
    console.log(`   ${tool.description}\n`);
  });
  process.exit(0);
}

// Parse command line arguments
const argv = yargs(hideBin(process.argv))
  .option('list-tools', {
    type: 'boolean',
    description: 'List all available tools and exit',
    default: false
  })
  .option('check-balance', {
    type: 'boolean',
    description: 'Check API balance and exit',
    default: false
  })
  .help()
  .parse() as Arguments;

// Handle command line options
if (argv['list-tools']) {
  listTools();
} else if (argv['check-balance']) {
  const server = new AISearchMCPServer();
  server.checkBalance().then(() => process.exit(0));
} else {
  // Start the MCP server
  const server = new AISearchMCPServer();
  server.run().catch(console.error);
}