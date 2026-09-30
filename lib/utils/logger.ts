/**
 * Tiny structured logger for server-side code. Emits one JSON line per entry so
 * logs stay machine-readable in production (Vercel, PM2, journald...).
 */
type Level = 'info' | 'warn' | 'error';

function write(level: Level, message: string, context?: Record<string, unknown>) {
  const entry = JSON.stringify({ level, time: new Date().toISOString(), message, ...context });
  if (level === 'error') console.error(entry);
  else if (level === 'warn') console.warn(entry);
  else console.info(entry);
}

export const logger = {
  info: (message: string, context?: Record<string, unknown>) => write('info', message, context),
  warn: (message: string, context?: Record<string, unknown>) => write('warn', message, context),
  error: (message: string, context?: Record<string, unknown>) => write('error', message, context),
};
