import dayjs from 'dayjs';
import _logger from 'pino';

const logger = _logger({
  base: {
    pid: false,
  },
  timestamp: () => `, "time":"${dayjs().format()}"`,
  transport: {
    target: 'pino-pretty',
    options: {
      colorize: true,
    },
  },
});
export default logger;
