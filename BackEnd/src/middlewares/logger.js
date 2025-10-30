import fs from "fs";
import path from "path";
import morgan from "morgan";


const logDirectory = path.resolve("logs");
if (!fs.existsSync(logDirectory)) {
    fs.mkdirSync(logDirectory);
}


const accessLogStream = fs.createWriteStream(path.join(logDirectory, "access.log"), { flags: "a" });


const logger = morgan(":method :url :status :response-time ms - :res[content-length]", {
    stream: accessLogStream,
});


const consoleLogger = morgan("dev");

export { logger, consoleLogger };
