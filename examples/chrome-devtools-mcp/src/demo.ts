/**
 * Chrome DevTools MCP Demo - Agent Mode
 * 
 * Demonstrates using Chrome DevTools MCP with mcp-use for:
 * - Test failure analysis
 * - Performance analysis
 * - Network/API debugging
 * - Console error investigation
 */

import { MCPAgent, MCPClient } from "mcp-use";
import { AzureChatOpenAI } from "@langchain/openai";
import { config } from "dotenv";

// Load environment variables
config();

// Validate environment
const requiredEnvVars = [
  "AZURE_OPENAI_API_KEY",
  "AZURE_OPENAI_ENDPOINT", 
  "AZURE_OPENAI_DEPLOYMENT_NAME"
];

for (const envVar of requiredEnvVars) {
  if (!process.env[envVar]) {
    console.error(`Missing required environment variable: ${envVar}`);
    console.error("Please copy .env.example to .env and configure your Azure OpenAI credentials.");
    process.exit(1);
  }
}

// Setup MCP Client with Chrome DevTools
const client = new MCPClient({
  mcpServers: {
    "chrome-devtools": {
      command: "npx",
      args: ["chrome-devtools-mcp@latest", "--headless=true", "--isolated=true"]
    }
  }
});

// Create Azure OpenAI LLM instance
const llm = new AzureChatOpenAI({
  azureOpenAIApiKey: process.env.AZURE_OPENAI_API_KEY,
  azureOpenAIApiInstanceName: process.env.AZURE_OPENAI_ENDPOINT?.replace("https://", "").replace(".openai.azure.com", ""),
  azureOpenAIApiDeploymentName: process.env.AZURE_OPENAI_DEPLOYMENT_NAME,
  azureOpenAIApiVersion: process.env.AZURE_OPENAI_API_VERSION || "2024-08-01-preview",
});

// Create MCP Agent
const agent = new MCPAgent({ 
  llm, 
  client, 
  maxSteps: 30 
});

// Demo scenarios
const scenarios = {
  // Scenario 1: Performance Analysis
  performance: `
    Navigate to https://developers.google.com and run a performance trace with reload.
    Analyze the Core Web Vitals (LCP, FCP, CLS, TBT) and identify the top 3 performance 
    issues with specific recommendations to fix them.
  `,

  // Scenario 2: Console Error Investigation
  consoleErrors: `
    Navigate to https://example.com, then list all console messages filtering for errors 
    and warnings. Analyze any errors found and provide insights on what might be causing 
    them and how to resolve them.
  `,

  // Scenario 3: Network/API Debugging
  networkDebug: `
    Navigate to https://jsonplaceholder.typicode.com/todos, list all network requests 
    (especially XHR/fetch), and show the details of the API requests made. Identify if 
    any requests failed and explain why.
  `,

  // Scenario 4: Element State Analysis
  elementState: `
    Navigate to https://example.com, take a verbose accessibility snapshot, and analyze 
    the page structure. Identify all interactive elements and their current states 
    (visible, disabled, focusable). This helps debug why a test might fail to find 
    or interact with an element.
  `,
};

async function runDemo(scenarioKey: keyof typeof scenarios) {
  console.log(`\n${"=".repeat(60)}`);
  console.log(`Running: ${scenarioKey}`);
  console.log("=".repeat(60));

  try {
    const result = await agent.run({
      prompt: scenarios[scenarioKey]
    });
    console.log("\n📊 Result:");
    console.log(result);
  } catch (error) {
    console.error("Error:", error);
  }
}

async function main() {
  const scenario = (process.argv[2] as keyof typeof scenarios) || "performance";
  
  if (!scenarios[scenario]) {
    console.log("Available scenarios:");
    Object.keys(scenarios).forEach(s => console.log(`  - ${s}`));
    console.log("\nUsage: npm run demo -- <scenario>");
    process.exit(1);
  }

  console.log("🚀 Chrome DevTools MCP Demo - Agent Mode");
  console.log("Using Azure OpenAI:", process.env.AZURE_OPENAI_DEPLOYMENT_NAME);
  
  await runDemo(scenario);
  
  // Cleanup
  await client.closeAllSessions();
  console.log("\n✅ Demo complete!");
}

main().catch(console.error);
