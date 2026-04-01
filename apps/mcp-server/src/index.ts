#!/usr/bin/env node

import * as dotenv from 'dotenv';
dotenv.config();

import { loadConfig } from './config.js';
import { runServer } from './server.js';

async function main() {
  try {
    const config = loadConfig();
    await runServer(config);
  } catch (error) {
    console.error('Failed to start Datto RMM MCP server:', error);
    process.exit(1);
  }
}

main();
