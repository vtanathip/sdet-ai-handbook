# Chrome DevTools MCP Demo

Minimal demo showcasing Chrome DevTools MCP for **test failure analysis** and debugging.

## Features

- **Test Failure Analysis** - DOM inspection, console errors, root cause identification
- **Performance Analysis** - Core Web Vitals, bottleneck identification  
- **Network/API Debugging** - Failed requests, payload inspection
- **Console Error Analysis** - Error stack traces, correlation with page state

## Prerequisites

- Node.js 18+
- Chrome browser installed
- Azure OpenAI API access (or standard OpenAI)

## Setup

```bash
# Install dependencies
pnpm install

# Configure environment
cp .env.example .env
# Edit .env with your Azure OpenAI credentials
```

## Usage

### Agent Mode (LLM-driven analysis)

```bash
# Run with default scenario (performance)
pnpm demo

# Run specific scenario
pnpm demo performance
pnpm demo consoleErrors
pnpm demo networkDebug
pnpm demo elementState
```

### Direct Tool Calling

```bash
pnpm demo:direct
```

## Available Scenarios

| Scenario | Description |
|----------|-------------|
| `performance` | Analyze Core Web Vitals and identify bottlenecks |
| `consoleErrors` | Investigate console errors and warnings |
| `networkDebug` | Debug API/network request issues |
| `elementState` | Analyze DOM element states for test debugging |

## Key MCP Tools

| Tool | Purpose |
|------|---------|
| `navigate_page` | Navigate to URL |
| `take_snapshot` | Get accessibility tree with element states |
| `list_console_messages` | Get console errors, warnings |
| `get_console_message` | Get detailed console message info |
| `list_network_requests` | Monitor network traffic |
| `get_network_request` | Get request/response details |
| `performance_start_trace` | Record Core Web Vitals |
| `performance_analyze_insight` | Deep dive into performance issues |

## Architecture

```
┌─────────────────┐     ┌─────────────────┐     ┌─────────────────┐
│   Your Script   │────▶│    mcp-use      │────▶│  Chrome DevTools│
│   (demo.ts)     │     │    MCPAgent     │     │      MCP        │
└─────────────────┘     └─────────────────┘     └─────────────────┘
        │                       │                       │
        │                       │                       ▼
        │                       │               ┌─────────────────┐
        │                       └──────────────▶│  Headless Chrome│
        │                                       └─────────────────┘
        ▼
┌─────────────────┐
│  Azure OpenAI   │
│   (LLM)         │
└─────────────────┘
```

## Notes

- Uses headless Chrome (no visible browser window)
- Isolated profile = fresh browser state each run
- All demos target public online websites
- No local server required
