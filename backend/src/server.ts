import dotenv from 'dotenv';
import app from './app';
import { warmupOllamaModel } from './ai/model';

dotenv.config();

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`[BeautyPilot Backend] Server running on port ${PORT}`);
  warmupOllamaModel().catch(() => {});
});
