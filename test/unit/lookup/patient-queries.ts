import { getPatientQueries } from '../../../src/lookup/patient-queries'

describe('Assembling lookup queries', () => {
    test('Should assemble all queries appropriately', () => {
        const lookup = getPatientQueries()
        expect(lookup.getAllPatients()).toEqual('SELECT p.*, a.time As AppointmentTime FROM patient p INNER JOIN appointment a ON p.mrn=a.mrn')
        expect(lookup.getPatientFromMRNAndLocation('abc','def')).toEqual('SELECT p.* FROM patient p INNER JOIN location l ON p.locationId=l.locationId WHERE p.mrn=\'abc\' AND l.locationName=\'def\'')
        expect(lookup.getPatientFromName('abc', 'def')).toEqual('SELECT * FROM patient WHERE firstName=\'abc\' AND lastName=\'def\'')
        expect(lookup.getPatientsForProvider('def', 'ghi')).toEqual('SELECT p.* FROM patient p INNER JOIN appointment a ON p.mrn=a.mrn INNER JOIN physician ph ON a.npi=ph.npi WHERE ph.firstName=\'def\' AND ph.lastName=\'ghi\'')
    });
  });