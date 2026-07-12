import app from './app';
import { env } from './config/env.config';

const PORT = env.PORT;

app.listen(PORT, () => {
  console.log(`[Server] Running in ${env.NODE_ENV} mode on port ${PORT}`);
  console.log(`[Server] Swagger documentation available at http://localhost:${PORT}/api/docs`);
});
