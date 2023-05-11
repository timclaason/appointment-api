// This file initializes the database, which will create it if it doesn't exist and create tables

import path from 'path'; 
import { closeDatabaseConection, initializeDatabase } from './database-commands';
import { getDatabaseObject } from '../getDatabaseObject';

const databaseObject = getDatabaseObject(`${path.join(__dirname, "../")}appointments.db`)
console.log('*** INITIALIZATION OF DATABASE BEGIN ***', `${path.join(__dirname, "../")}appointments.db`)
initializeDatabase(databaseObject, `${__dirname}/database-setup/create/create-tables.sql`)
closeDatabaseConection(databaseObject)
console.log('*** INITIALIZATION OF DATABASE END   ***')