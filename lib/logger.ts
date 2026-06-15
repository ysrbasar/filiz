type LogContext = Record<string, unknown>

function sanitizeForLogs(ctx?: LogContext): LogContext {
  if (!ctx) return {}
  const { password: _p, token: _t, apiKey: _a, creditCard: _c, ...safe } = ctx as Record<string, unknown>
  return safe
}

export const logger = {
  error: (msg: string, ctx?: LogContext) => {
    console.error(JSON.stringify({
      level: 'error',
      message: msg,
      ...sanitizeForLogs(ctx),
      timestamp: new Date().toISOString(),
    }))
  },
  security: (event: string, ctx?: LogContext) => {
    console.warn(JSON.stringify({
      level: 'security',
      event,
      ...sanitizeForLogs(ctx),
      timestamp: new Date().toISOString(),
    }))
  },
  info: (msg: string, ctx?: LogContext) => {
    if (process.env.NODE_ENV !== 'production') {
      console.log(JSON.stringify({
        level: 'info',
        message: msg,
        ...sanitizeForLogs(ctx),
      }))
    }
  },
}
