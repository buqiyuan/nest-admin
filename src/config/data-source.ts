import 'reflect-metadata';
import { config } from 'dotenv';
import { DataSource } from 'typeorm';
import { getConfiguration } from './configuration';

config({ path: '.env.development' });

export default new DataSource(getConfiguration().database);
