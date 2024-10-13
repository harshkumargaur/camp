const { format, transports } = require('winston');
const { combine, timestamp, label, printf } = format;

const myFormat = printf(({ level, message, label, timestamp }) => {
  return `\n${timestamp} [${label}] ${level}: ${message}\n *******************************************************`;
});

const loggerOptions = {
  level: 'info',
  defaultMeta: { service: 'user-service' },
  format: combine(
    label({ label: 'exception or rejection' }),
    timestamp(),
    myFormat
  ),
  exceptionHandlers: [
    new transports.File({
      filename: `${__dirname}/../logs/exceptions.log`,
    }),
  ],
  rejectionHandlers: [
    new transports.File({ filename: `${__dirname}/../logs/rejections.log` }),
  ],
};
module.exports = loggerOptions;
