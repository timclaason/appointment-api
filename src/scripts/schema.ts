// This file defines expected schemas for anticipated tables within the databse, along
// with supporting types
export type ValueTypes = 'TEXT' | 'INTEGER' | 'DATE' | 'TIMESTAMP';

export interface DatabaseSchema {
    [key: string]: ValueTypes;
  }

export const patientSchema: DatabaseSchema = {
    mrn: 'TEXT',
    firstName: 'TEXT',
    lastName: 'INTEGER',
    birthdate: 'DATE',
    locationId: 'TEXT'
};

export const locationSchema: DatabaseSchema = {
    locationId: 'TEXT',
    locationName: 'TEXT'
};

export const physicianSchema: DatabaseSchema = {
    npi: 'TEXT',
    firstName: 'TEXT',
    lastName: 'TEXT'
}

export const appointmentsSchema: DatabaseSchema = {
    appointmentId: 'TEXT',
    mrn: 'TEXT',
    npi: 'TEXT',
    time: 'TIMESTAMP',
}