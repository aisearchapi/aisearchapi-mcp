#!/usr/bin/env node

/**
 * Test script for AI Search API MCP Server
 * This script helps verify that your setup is working correctly
 */

import { spawn } from 'child_process';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const serverPath = join(__dirname, 'dist', 'index.js');

console.log('🧪 Testing AI Search API MCP Server\n');

// Test 1: Check if server file exists
import { existsSync } from 'fs';
if (!existsSync(serverPath)) {
  console.error('❌ Server not built. Run "npm run build" first.');
  process.exit(1);
}
console.log('✅ Server file found');

// Test 2: Check environment variable
if (!process.env.AISEARCHAPI_KEY) {
  console.error('❌ AISEARCHAPI_KEY environment variable not set');
  console.log('   Set it in .env file or export it:');
  console.log('   export AISEARCHAPI_KEY=your-key-here');
  process.exit(1);
}
console.log('✅ API key configured');

// Test 3: List tools
console.log('\n📋 Listing available tools...\n');
const listTools = spawn('node', [serverPath, '--list-tools']);

listTools.stdout.on('data', (data) => {
  process.stdout.write(data);
});

listTools.on('close', (code) => {
  if (code !== 0) {
    console.error('\n❌ Failed to list tools');
    process.exit(1);
  }
  
  // Test 4: Check balance (optional)
  console.log('\n💰 Checking API balance...\n');
  const checkBalance = spawn('node', [serverPath, '--check-balance']);
  
  checkBalance.stdout.on('data', (data) => {
    process.stdout.write(data);
  });
  
  checkBalance.stderr.on('data', (data) => {
    process.stderr.write(data);
  });
  
  checkBalance.on('close', (balanceCode) => {
    if (balanceCode === 0) {
      console.log('\n✅ Balance check successful');
    } else {
      console.log('\n⚠️  Balance check failed (check your API key)');
    }
    
    // Test 5: Test MCP protocol
    console.log('\n🔧 Testing MCP protocol...\n');
    const mcp = spawn('node', [serverPath]);
    
    // Send a list tools request
    const request = JSON.stringify({
      jsonrpc: "2.0",
      method: "tools/list",
      id: 1
    }) + '\n';
    
    mcp.stdin.write(request);
    
    let response = '';
    mcp.stdout.on('data', (data) => {
      response += data.toString();
      if (response.includes('"result"')) {
        console.log('✅ MCP protocol working');
        mcp.kill();
        
        console.log('\n🎉 All tests passed! Your AI Search API MCP server is ready to use.');
        console.log('\n📝 Next steps:');
        console.log('1. Add the server to your Claude Desktop configuration');
        console.log('2. Restart Claude Desktop');
        console.log('3. Start using AI Search tools in Claude!\n');
        process.exit(0);
      }
    });
    
    setTimeout(() => {
      console.error('❌ MCP protocol test timeout');
      mcp.kill();
      process.exit(1);
    }, 5000);
  });
});