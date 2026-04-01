import fs from 'fs';
import { format } from 'util';

let logStream: fs.WriteStream | null = null;

/**
 * Initialize the logger.
 */
export function initLogger(logFilePath?: string): void {
  if (logFilePath) {
    logStream = fs.createWriteStream(logFilePath, { flags: 'a' });
    
    // Redirect console.error and console.warn to the log file as well
    const originalError = console.error;
    console.error = (...args: any[]) => {
      logToFile('ERROR', format(...args));
      originalError.apply(console, args);
    };

    const originalWarn = console.warn;
    console.warn = (...args: any[]) => {
      logToFile('WARN', format(...args));
      originalWarn.apply(console, args);
    };

    // We DON'T redirect console.log because that might be used by the MCP stdio transport
  }
}

/**
 * Log a message to the file (or stderr if no file).
 */
function logToFile(level: string, message: string): void {
  const timestamp = new Date().toISOString();
  const logMessage = `[${timestamp}] [${level}] ${message}\n`;
  
  if (logStream) {
    logStream.write(logMessage);
  } else {
    process.stderr.write(logMessage);
  }
}

export const logger = {
  info: (msg: string, ...args: any[]) => logToFile('INFO', format(msg, ...args)),
  warn: (msg: string, ...args: any[]) => logToFile('WARN', format(msg, ...args)),
  error: (msg: string, ...args: any[]) => logToFile('ERROR', format(msg, ...args)),
  debug: (msg: string, ...args: any[]) => logToFile('DEBUG', format(msg, ...args)),
};
