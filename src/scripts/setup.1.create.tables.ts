// This script inserts records into the appropriate tables.  The assumption is that this will be run after the database initialization

import path from 'path'; 
import { closeDatabaseConection, importTable } from './database-commands';
import { physicianSchema, appointmentsSchema, locationSchema, patientSchema } from './schema';
import { getDatabaseObject } from '../getDatabaseObject';

const databasePath = `${path.join(__dirname, "../")}/appointments.db`
const jsonPath = `${__dirname}/database-setup/insert`
const databaseObject = getDatabaseObject(databasePath)

console.log('*** IMPORT OF TABLE DATA BEGIN ***')
importTable(databaseObject, 'location', `${jsonPath}/locations.json`, locationSchema)
importTable(databaseObject, 'physician', `${jsonPath}/physicians.json`, physicianSchema)
importTable(databaseObject, 'patient', `${jsonPath}/patients.json`, patientSchema)
importTable(databaseObject, 'appointment', `${jsonPath}/appointments.json`, appointmentsSchema)
closeDatabaseConection(databaseObject)
console.log('*** IMPORT OF TABLE DATA END   ***')