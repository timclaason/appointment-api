export interface Patient {
    firstName: string
    lastName: string
    birthdate: Date
    mrn: string
    location: string
}

export type PatientWithAppointment = Patient & { AppointmentTime: Date}

export interface Location {
    locationId: string
    locationName: string
}

export interface Physician {
    npi: string
    firstName: string
    lastName: string
}

export interface Appointment {
    appointmentId: string
    mrn: string
    npi: string
    time: Date
}
