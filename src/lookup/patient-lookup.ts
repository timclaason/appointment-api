import sqlite3 from 'sqlite3'
import { PatientLookup, PatientQueries } from "../@types"
import { Patient, PatientWithAppointment } from '../@types/business'
import { isEmpty, isNil } from 'ramda'

/**
 * This function contains methods to lookup data in the SQLite database, leveraging the
 * PatientQueries type, which helps it to assemble the queries to send to the SQLite engine
 * 
 * @param db sqlite.Database object
 * @param queries A queries object for fast access to database queries
 * @returns PatientLookup assembly
 */
export const getPatientLookup =  (db: sqlite3.Database, queries: PatientQueries): PatientLookup => {
    /**
     * This function looks up in the database for a patient with a matching name and birthdate.  Because of
     * some technical difficulties I had querying the database for a date, I handled that logic in code
     * A to-do for the future would be to spend time to fix that.
     * 
     * @param firstName Firstname of the patient
     * @param firstName Lastname of the patient
     * @param dateOfBirth Presumed birthdate of the patient
     * @returns Patient promise or null
     */
    const getPatientFromName = async (firstName: string, lastName: string, dateOfBirth: Date): Promise<Patient | null> => {
        return new Promise((resolve) => {
            db.all(queries.getPatientFromName(firstName, lastName), [], (err, rows) => {
                if (err || isNil(rows) || isEmpty(rows)) {
                    resolve(null)
                } else {
                    const patient = rows[0] as Patient
                    if(new Date(patient.birthdate) >= new Date(dateOfBirth.getTime() - (24 * 60 * 60 * 1000)) && new Date(patient.birthdate) <= new Date(dateOfBirth.getTime() + (24 * 60 * 60 * 1000))) {
                        resolve(rows[0] as Patient);
                    } else {
                        resolve(null)
                    }
                }
            });
        });
    }

    /**
     * This function looks up in the database for a patient with a matching MRN and appointment location.  
     * 
     * @param mrn Medical Record Number of the patient
     * @param Location Location string (not id) of the patient
     * @returns Patient promise or null
     */
    const getPatientFromMRNAndLocation = (mrn: string, location: string): Promise<Patient | null> => {
        return new Promise((resolve) => {
            db.all(queries.getPatientFromMRNAndLocation(mrn, location), [], (err, rows) => {
                resolve(err ? null : rows[0] as Patient)
            });
        });
    }

    /**
     * This function looks up in the database for patients with appointments between 2 dates
     * 
     * @param beginDate Begin Range
     * @param endDate End range
     * @returns Patient array promise, which can be empty
     */
    const getPatientAppointmentsFromDateRange = async (beginDate: Date, endDate: Date): Promise<Patient[]> => {
        const result = new Promise((resolve) => {
            db.all(queries.getAllPatients(), [], (err, rows) => {
                resolve(err ? [] : rows as PatientWithAppointment[])
            });
        });

        const awaitedResult = await result
        return Array.isArray(awaitedResult) ? awaitedResult.map(i=> {
            const appointmentTime = new Date(i.AppointmentTime)
            console.log('is between', appointmentTime, beginDate, endDate, appointmentTime >= beginDate && appointmentTime <= endDate)
            if(appointmentTime >= beginDate && appointmentTime <= endDate) return i
        }).filter(i=>!isNil(i) && !isEmpty(i)) : []
    }

    /**
     * This function looks up in the database for patients who have appointments with a given provider 
     * 
     * @param firstName Provider first name
     * @param lastName Provider last name
     * @returns Patient array promise, which can be empty
     */
    const getPatientsForProvider = (firstName: string, lastName: string): Promise<Patient[]> => {
        return new Promise((resolve) => {
            db.all(queries.getPatientsForProvider(firstName, lastName), [], (err, rows) => {
                resolve(err ? [] : rows as Patient[])
            });
        });
    }

    return {
        getPatientFromName,
        getPatientFromMRNAndLocation,
        getPatientAppointmentsFromDateRange,
        getPatientsForProvider
    }
}