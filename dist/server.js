import app from "./app";
import config from "./config";
import { initDB } from "./db";
const port = config.port;
const main = async () => {
    try {
        await initDB();
        app.listen(port, () => {
            console.log(`Server running on port ${port}`);
        });
    }
    catch (error) {
        console.log("Failed to connect database", error);
    }
};
main();
//# sourceMappingURL=server.js.map