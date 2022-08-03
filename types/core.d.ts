/**
 * Namespace name must be changed for the original project name
 */
declare namespace ProjectName {
  /**
   * Interface for Logger
   * @interface Logger
   */
  export interface Logger {
    error(message?: unknown, ...optionalParams: unknown[]): void,
    info(message?: unknown, ...optionalParams: unknown[]): void,
    log(message?: unknown, ...optionalParams: unknown[]): void,
    warn(message?: unknown, ...optionalParams: unknown[]): void
  }
}
