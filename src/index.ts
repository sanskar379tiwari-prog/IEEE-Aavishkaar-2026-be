import dotenv from "dotenv";
import { connectDatabase } from "@/config/db";

dotenv.config();

import app from "./app";

const PORT = process.env.PORT || 3000;

async function bootstrap() {
    try {
        await connectDatabase();
        app.listen(PORT, () => {
            console.log(`Server running on http://localhost:${PORT}`);
        });
    } catch (error) {
        console.error("Failed to start server:", error);
        process.exit(1);
    }
}

void bootstrap();