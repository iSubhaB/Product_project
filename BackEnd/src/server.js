import app from "./app.js";
import { logger } from "./middlewares/logger.js";

const PORT = process.env.PORT || 5000;
app.use(logger);
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
