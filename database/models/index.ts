import { Sequelize, SequelizeOptions } from 'sequelize-typescript';
import dotenv from 'dotenv';
import { basename as _basename } from 'path';
import { Users } from './Users';
import { File } from './Files';
import { UserTokens } from './UserTokens';


dotenv.config();
_basename(__filename);
const env = process.env.NODE_ENV || 'development';

interface CustomSequelizeOptions extends SequelizeOptions {
  use_env_variable?: string;
}

async function loadConfig(): Promise<CustomSequelizeOptions> {
  try {
    const configModule = await import(__dirname + '/../config/config.js');
    if (!configModule[env]) {
      new Error(
        `Configuration for environment "${env}" not found in config.js`,
      );
    }
    return configModule[env] as CustomSequelizeOptions;
  } catch (error) {
    console.error('Error loading configuration:', error);
    throw error;
  }
}

export async function initializeSequelize(): Promise<Sequelize> {
  const config = await loadConfig();
  let sequelize: Sequelize;
  if (config.use_env_variable) {
    sequelize = new Sequelize(
      process.env[config.use_env_variable] as string,
      config,
    );
  } else {
    sequelize = new Sequelize(
      config.database as string,
      config.username as string,
      config.password as string,
      config,
    );
  }

  try {
    await sequelize.authenticate();
    console.log('Connection to database established successfully.');
  } catch (error) {
    console.error('Error connecting to database:', error);
    throw error;
  }

  return sequelize;
}

async function initializeModels(): Promise<void> {
  const sequelize = await initializeSequelize();
  sequelize.addModels([
    Users, File, UserTokens,
  ]);

  try {
    await sequelize.sync();
    console.log('All models were synchronized successfully.');
  } catch (error) {
    console.error('Error synchronizing models:', error);
    throw error;
  }
}

export {
  Users,
  File,
  UserTokens,
  initializeModels,
};
