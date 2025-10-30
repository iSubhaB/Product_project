import fs from "fs";
import path from "path";
import morgan from "morgan";

// Create logs directory if not exists
const logDirectory = path.resolve("logs");
if (!fs.existsSync(logDirectory)) {
    fs.mkdirSync(logDirectory);
}

// Write logs to file (daily rolling optional)
const accessLogStream = fs.createWriteStream(path.join(logDirectory, "access.log"), { flags: "a" });

// Morgan format: method + url + status + response time
const logger = morgan(":method :url :status :response-time ms - :res[content-length]", {
    stream: accessLogStream,
});

// Also print to console
const consoleLogger = morgan("dev");

export { logger, consoleLogger };
