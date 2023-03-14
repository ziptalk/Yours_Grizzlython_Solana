import { createLogger, transports, format } from 'winston';
import winstonDaily from 'winston-daily-rotate-file'; 

interface TransformableInfo {
  level: string;
  message: string;
  [key: string]: any;
}
const logFormat = format.printf((info: TransformableInfo) => {
  return `${info.timestamp} - ${info.level}: ${info.label} ${info.message}`;
});

const logger = createLogger({
  format: format.combine(
    format.label({ label: '[yours-server]' }),
    format.timestamp({
      format: 'YYYY-MM-DD HH:mm:ss',
    }),
    logFormat,
  ),
  transports: [
    new transports.Console({
      format: format.combine(format.colorize(), logFormat),
    }),
    new winstonDaily({
      level: 'info', // info 레벨에선
      datePattern: 'YYYY-MM-DD', // 파일 날짜 형식
      dirname: `${process.cwd()}/logs/info`, // 파일 경로
      filename: `%DATE%.log`, // 파일 이름
      maxFiles: 30, // 최근 30일치 로그 파일을 남김
    }),
    new winstonDaily({
      level: 'error', // error 레벨에선
      datePattern: 'YYYY-MM-DD', // 파일 날짜 형식
      dirname: `${process.cwd()}/logs/error`, // 파일 경로
      filename: `%DATE%.error`, // 파일 이름
      maxFiles: 30, // 최근 30일치 로그 파일을 남김
    }),
  ],
});
export default logger;
