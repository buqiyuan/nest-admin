import 'reflect-metadata';
import { config } from 'dotenv';
import { DataSource } from 'typeorm';
import { getConfiguration } from './configuration';

config();

export const AppDataSource = new DataSource(getConfiguration().database);
