import {MongoClient, Db} from 'mongodb';
import {isProduction} from '../utils/is_production';

// Exhaustive list of all collections
export const COLLECTIONS = {
  CMS_DATA: 'cms_data' // This collection is used by the CMS library
};

// Return connection URL for the current environment
export function getConnectionURL(): string {
  return isProduction() ? process.env.MONGO_DB_CONNECTION_URL_PROD : process.env.MONGO_DB_CONNECTION_URL_DEV;
}

// Create an open connection to mongodb. Database connection is
// made in the 'server.tsx' file when the application is started
export function connectToDb(): Promise<Db> {
  // Tell mongodb what promise library to use
  const promiseConfig = {promiseLibrary: Promise};
  return MongoClient.connect(getConnectionURL(), promiseConfig);
}
