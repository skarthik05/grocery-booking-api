import { ConsoleLogger, Injectable } from '@nestjs/common';

@Injectable()
export class CustomLoggerService extends ConsoleLogger {
  constructor() {
    super();
  }

  customError(message: string, trace?: string, context?: string) {
    super.error(message, trace, context);
  }

  customWarn(message: string, context?: string) {
    super.warn(message, context);
  }

  customDebug(message: string, context?: string) {
    super.debug(message, context);
  }

  customVerbose(message: string, context?: string) {
    super.verbose(message, context);
  }
}
