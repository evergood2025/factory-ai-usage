# Factory AI Usage Dashboard

[中文文档](./README_CN.md)

A tool to check your Factory AI API token usage and remaining quota.

## How it works

Fetches usage data from Factory AI's `/api/organization/members/chat-usage` endpoint.

## Features

- **Keys stored locally** - API Keys are saved in browser localStorage, never uploaded to any server
- **Multi-key management** - Save multiple keys and switch between them
- **Bilingual** - English and Chinese interface

## Usage

```bash
# Install dependencies
bun install

# Start dev server
bun dev

# Build
bun run build
```

## Deployment

Production requires a proxy to forward `/api` requests to `https://app.factory.ai`.

## License

For personal learning and non-commercial use only.
