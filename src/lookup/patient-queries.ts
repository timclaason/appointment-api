import { PatientQueries } from "../@types"

/**
 * This function contains a quick way to assemble the string queries
 * The idea is that future iterations of this code will use less risky
 * approaches to assembling and sending queries
 * Closely aligns to the patient-lookup.ts file
 * 
 * @returns A collection of methods which provide insight into how to query the Sqlite database
 */
export const getPatientQueries =  (): PatientQueries => {
    const getPatientFromName = (firstName: string, lastName: string): string => {
        return `SELECT * FROM patient WHERE firstName='${firstName}' AND lastName='${lastName}'`
    }

    const getPatientFromMRNAndLocation = (mrn: string, location: string): string => {
        return `SELECT p.* FROM patient p INNER JOIN location l ON p.locationId=l.locationId WHERE p.mrn='${mrn}' AND l.locationName='${location}'`
    }

    const getPatientsForProvider = (firstName: string, lastName: string): string => {
        const query = `SELECT p.* FROM patient p INNER JOIN appointment a ON p.mrn=a.mrn INNER JOIN physician ph ON a.npi=ph.npi WHERE ph.firstName='${firstName}' AND ph.lastName='${lastName}'`
        console.log('query', query)
        return query
    }

    const getAllPatients = (): string => {
        return `SELECT p.*, a.time As AppointmentTime FROM patient p INNER JOIN appointment a ON p.mrn=a.mrn`
    }

    return {
        getPatientFromName,
        getPatientFromMRNAndLocation,
        getPatientsForProvider,
        getAllPatients
    }
}