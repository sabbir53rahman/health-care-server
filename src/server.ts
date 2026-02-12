import app from "./app";
import { envVars } from "./config/env";

const bootstrap = () => {
  try {
    app.listen(envVars.PORT, () => {
      console.log(`Server is running on PORT 5000`);
    });
  } catch (err) {
    console.error("Failed to start server:", err);
  }
};

bootstrap();
