class Logger {
  error (context, msg) {
    console.error(context, msg);
  }
}

const logger = new Logger();

export default logger;
