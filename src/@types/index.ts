import { Patient } from "./business"

export interface PatientQueries {
    getPatientFromName: (firstName: string, lastName: string) => string
    getPatientFromMRNAndLocation: (mrn: string, location: string) => string
    getPatientsForProvider: (firstName: string, lastName: string) => string
    getAllPatients: () => string
}

export interface PatientLookup {
    getPatientFromName: (firstName: string, lastName: string, dateOfBirth: Date) => Promise<Patient | null>
    getPatientFromMRNAndLocation: (mrn: string, location: string) => Promise<Patient | null>
    getPatientAppointmentsFromDateRange: (beginDate: Date, endDate: Date) => Promise<Patient[]>
    getPatientsForProvider: (firstName: string, lastName: string) => Promise<Patient[]>
}