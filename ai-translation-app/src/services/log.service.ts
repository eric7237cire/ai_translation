import { isNil } from "lodash";

// LogLevels.js
export class LogLevels {
  static DEBUG: number = 1;
  static INFO: number = 2;
  static WARN: number = 3;
  static ERROR: number = 4;
}

interface LogEntry {
  level: number;
  message: string;
  obj: unknown | null;
  timestamp: string;
}

export class Logger {
  static instance: Logger | null = null;
  private logs: Array<LogEntry> = [];
  private level: number = LogLevels.DEBUG;

  static getInstance(): Logger {
    if (!Logger.instance) {
      Logger.instance = new Logger();
    }
    return Logger.instance;
  }

  constructor() {
    if (Logger.instance) {
      return Logger.instance;
    }

    this.logs = [];
    this.level = LogLevels.DEBUG; // Default log level
    Logger.instance = this;
  }

  setLevel(level: number) {
    this.level = level;
  }

  log(level: number, message: string, obj: unknown = null): void {
    if (level < this.level) {
      return;
    }

    const timestamp: string = new Date().toISOString();
    const entry: LogEntry = { level, message, obj, timestamp };
    this.logs.push(entry);

    const output = `[${this.levelToString(level)}] ${timestamp} - ${message}`;

    if (level === LogLevels.DEBUG) {
      if (isNil(obj)) {
        console.debug(output);
      } else {
        console.debug(output, obj);
      }
    } else if (level === LogLevels.INFO) {
      if (isNil(obj)) {
        console.info(output);
      } else {
        console.info(output, obj);
      }
    } else if (level === LogLevels.WARN) {
      if (isNil(obj)) {
        console.warn(output);
      } else {
        console.warn(output, obj);
      }
    } else if (level === LogLevels.ERROR) {
      if (isNil(obj)) {
        console.error(output);
      } else {
        console.error(output, obj);
      }
    }
  }

  debug(message: string, obj: unknown = null): void {
    this.log(LogLevels.DEBUG, message, obj);
  }

  info(message: string, obj: unknown = null): void {
    this.log(LogLevels.INFO, message, obj);
  }

  warn(message: string, obj: unknown = null): void {
    this.log(LogLevels.WARN, message, obj);
  }

  error(message: string, obj: unknown = null): void {
    this.log(LogLevels.ERROR, message, obj);
  }

  getLogs(): LogEntry[] {
    return this.logs;
  }

  clearLogs() {
    this.logs = [];
  }

  private levelToString(level: number): string {
    switch (level) {
      case LogLevels.DEBUG:
        return "DEBUG";
      case LogLevels.INFO:
        return "INFO";
      case LogLevels.WARN:
        return "WARN";
      case LogLevels.ERROR:
        return "ERROR";
      default:
        return "UNKNOWN";
    }
  }
}
