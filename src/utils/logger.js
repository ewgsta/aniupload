export const logger = {
    info: (message, ...meta) => console.info(`[INFO] ${message}`, ...meta),
    error: (message, ...meta) => console.error(`[ERROR] ${message}`, ...meta),
    warn: (message, ...meta) => console.warn(`[WARN] ${message}`, ...meta),
    debug: (message, ...meta) => console.debug(`[DEBUG] ${message}`, ...meta),
};
//# sourceMappingURL=logger.js.map