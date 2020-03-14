const appRoot = require('app-root-path')
const { createLogger, transports, format } = require('winston')
const { combine, timestamp, printf, metadata } = format

const errorPrinter = format(info => {
  if (!info.error) return info

  // Handle case where Error has no stack.
  const errorMsg = info.error.stack || info.error.toString()
  info.message += `\n${errorMsg}`

  return info
})

const logger = createLogger({
  format: combine(
    metadata(),
    timestamp({ format: 'YYYY-MM-DD HH:mm:ss:ms' }),
    errorPrinter(),
    printf(info => `${info.timestamp} ${info.level}: ${info.message}`)
  ),
  transports: [
    new transports.File({
      filename: `${appRoot}/logs/chronicler.log`,
      json: false,
      maxsize: 5242880,
      maxFiles: 5,
    }),
    new transports.Console(),
  ]
})

export default logger