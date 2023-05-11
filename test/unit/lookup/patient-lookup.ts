import { getPatientLookup } from '../../../src/lookup/patient-lookup';
import { Database } from 'sqlite3';


const db = new Database(':memory:');
const queries = {
  getPatientFromName: (firstName: string, lastName: string) => `
    SELECT * FROM patient
    WHERE firstName = '${firstName}' AND lastName = '${lastName}'
  `,
  getPatientFromMRNAndLocation: (mrn: string, location: string) => `SELECT * FROM patient WHERE mrn='${mrn}' AND location='${location}'`
};
const testPatient = {
  id: 1,
  firstName: 'John',
  lastName: 'Doe',
  birthdate: new Date('1980-01-01'),
  mrn: 'abc-123-def',
  location: 'fed-321-cba'
};

beforeAll((done) => {
  db.run(`
    CREATE TABLE patient (
      id INTEGER PRIMARY KEY,
      firstName TEXT NOT NULL,
      lastName TEXT NOT NULL,
      birthdate TEXT NOT NULL,
      mrn TEXT,
      location TEXT
    );
  `, (err) => {
    if (err) {
      done.fail(err);
    } else {
      db.run(`
        INSERT INTO patient (id, firstName, lastName, birthdate, mrn, location)
        VALUES (${testPatient.id}, '${testPatient.firstName}', '${testPatient.lastName}', '${testPatient.birthdate.toISOString()}', '${testPatient.mrn}', '${testPatient.location}');
      `, done);
    }
  });
});

const lookup = getPatientLookup(db, queries as any)

describe('getPatientFromName', () => {
  test('returns patient when name and birthdate match', async () => {
    const patient = await lookup.getPatientFromName(testPatient.firstName, testPatient.lastName, testPatient.birthdate);
    expect(patient).toMatchObject({firstName: testPatient.firstName, lastName: testPatient.lastName, id: testPatient.id})
  });

  test('returns null when name does not match', async () => {
    const patient = await lookup.getPatientFromName('Jane', testPatient.lastName, testPatient.birthdate);
    expect(patient).toBeNull();
  });

  test('returns null when birthdate does not match', async () => {
    const patient = await lookup.getPatientFromName(testPatient.firstName, testPatient.lastName, new Date('1990-01-01'));
    expect(patient).toBeNull();
  });

  test('returns null when no patient found', async () => {
    const patient = await lookup.getPatientFromName('Nonexistent', 'Patient', testPatient.birthdate);
    expect(patient).toBeNull();
  });

  test('returns null when db.all fails', async () => {
    // Mock db.all to fail
    const dbAllMock = jest.spyOn(db, 'all').mockImplementation((_query: string, _params: any, callback) => callback(new Error('Mocked error'), []));

    const patient = await lookup.getPatientFromName(testPatient.firstName, testPatient.lastName, testPatient.birthdate);
    expect(patient).toBeNull();

    dbAllMock.mockRestore(); // Restore original implementation
  });

  test('returns null when rows is empty', async () => {
    // Mock db.all to return empty rows
    const dbAllMock = jest.spyOn(db, 'all').mockImplementation((_query: string, _params: any, callback) => callback(null, []));

    const patient = await lookup.getPatientFromName(testPatient.firstName, testPatient.lastName, testPatient.birthdate);
    expect(patient).toBeNull();

    dbAllMock.mockRestore(); // Restore original implementation
  });

  test('returns null when rows is undefined', async () => {
    // Mock db.all to return undefined rows
    const dbAllMock = jest.spyOn(db, 'all').mockImplementation((_query, _params, callback) => callback(null, undefined));

    const patient = await lookup.getPatientFromName(testPatient.firstName, testPatient.lastName, testPatient.birthdate);
    expect(patient).toBeNull();

    dbAllMock.mockRestore(); // Restore original implementation
  });
})

describe('getPatientFromMRNAndLocation', () => {
    test('returns null when patient not found', async () => {
      const patient = await lookup.getPatientFromMRNAndLocation('123456789', 'Test Clinic');
      expect(patient).toBeUndefined();
    });
  
    test('returns patient when MRN and location match', async () => {
      const patient = await lookup.getPatientFromMRNAndLocation(testPatient.mrn, testPatient.location);
      expect(patient).toMatchObject({mrn: testPatient.mrn, location: testPatient.location, lastName: testPatient.lastName, firstName: testPatient.firstName})
    });
  });