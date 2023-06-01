import app from "@/app";
import config from "@config/env";

app.listen(config.port, () => `Listening at http://localhost:${config.port}`)