import dotenv from 'dotenv';
import { loadConfig, type AppConfig } from '@yt-studio/shared';

dotenv.config();

export const config: AppConfig = loadConfig();
