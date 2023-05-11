import { Router } from 'express';
import { getPatientQueries } from '../../lookup/patient-queries';
import { isNil, isEmpty } from 'ramda';
import sqlite from 'sqlite3';
import { getSourceDirectory } from '../../utils';
import { databaseFilename } from '../../config';
import { getPatientLookup } from '../../lookup/patient-lookup';


// Export module for registering router in express app
export const router: Router = Router();
const queries = getPatientQueries()
const db = new sqlite.Database(`${getSourceDirectory()}/${databaseFilename}`, sqlite.OPEN_READWRITE);
const lookup = getPatientLookup(db, queries)

  // Granular patient lookup.  The idea is that single request logic can be handled in this GET route
  router.get("/patient/*", async (req, res) => {
    const search = req.path.split('/')

    if(isNil(search) || isEmpty(search) || search.length < 3 || search.length > 5) {
      res.status(400).send({
        message: "Invalid search terms"
      });
      return;
    }

    console.log('Received Patient Lookup Request', {body: req.body, baseurl: req.baseUrl, original: req.originalUrl, params: req.params, path: req.path})
    const result = search.length === 5 ? await lookup.getPatientFromName(search[2], search[3], new Date(search[4])) : await lookup.getPatientFromMRNAndLocation(search[2], search[3])
    res.status(200).send({
          message: "Search results",
          result
    });
  });

  // Route for multi-patient requests, such as all patients for a particular date range or provider
  router.get("/patients/", async (req, res) => {
    console.log('Received Patients Lookup Request', {body: req.body, baseurl: req.baseUrl, original: req.originalUrl, params: req.params, path: req.path, query: req.query})

    if(!isNil(req.query.begin) && !isNil(req.query.end)) {
        const result = await lookup.getPatientAppointmentsFromDateRange(new Date(req.query.begin.toString()), new Date(req.query.end.toString()))
        res.status(200).send({message: "Search Results - Date Range", result})
        return
    } else if(!isNil(req.query.firstName) && !isNil(req.query.lastName)) {
        const result = await lookup.getPatientsForProvider(req.query.firstName.toString(), req.query.lastName.toString())
        res.status(200).send({message: "Search Results - Provider", result})
        return
    } else {
      res.status(400).send({message: "Search Results", result: 'Invalid search term'})
    }
  });
