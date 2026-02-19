import { env } from './environment.js';
import winston from "winston";
const enumerateErrorFormat = winston.format((info) => {
    if (info instanceof Error) {
        Object.assign(info, { message: info.stack });
    }
    return info;
});
const logger = winston.createLogger({
    level: env.NODE_ENV === 'development' ? 'debug' : 'info',
    format: winston.format.combine(enumerateErrorFormat(), winston.format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }), env.NODE_ENV === 'development'
        ? winston.format.colorize()
        : winston.format.uncolorize(), winston.format.splat(), winston.format.printf(({ level, message, timestamp }) => `${timestamp} ${level}: ${message}`)),
    transports: [new winston.transports.Console({ stderrLevels: ['error'] })],
});
export default logger;
//# sourceMappingURL=logger.js.map