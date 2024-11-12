import { PRODUCTION } from "../environment";



type LoggingMethod = typeof console.log;
export const developmentLogger = (
  method: LoggingMethod,
  ...messages: string[]
) => {
  if (!PRODUCTION) {
    method(...messages);
  }
};