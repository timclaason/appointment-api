import * as fs from 'fs'
import {isNil} from 'ramda'
import { DatabaseSchema } from './schema';
import sqlite3 from 'sqlite3'

/**
 * A function to import data into a given table with a given schema.  This is currently rather rigid
 * in that it expects certain order of columns.  It is also not currently checking for pre-existing records,
 * which is easy enough to solve, but due to time constraints, I was worried about injecting too much complexity
 * 
 * @param db sqlite.Database object
 * @param tableName Name of the database table
 * @param jsonFile Input file containing JSON records
 * @param schema Schema object to define the table design
 * @returns void
 */
export const importTable = (db: sqlite3.Database, tableName: string, jsonFile: string, schema: DatabaseSchema) => {
    console.log(`BEGIN\tImporting table [${tableName}]\tJSON file ${jsonFile}`);
    const jsonData = fs.readFileSync(jsonFile, 'utf8');
    const data = JSON.parse(jsonData);
    
    // Loop through each row of data and insert into the table
    db.serialize(() => {
        const columns = Object.keys(schema).join(', ');
        const placeholders = Object.keys(schema).map(() => '?').join(', ');
        const stmt = db.prepare(`INSERT INTO ${tableName} (${columns}) VALUES (${placeholders})`);
        
        for (const row of data) {
            const values = Object.keys(schema).map(column => row[column]);
            stmt.run(values);
        }
        
        stmt.finalize();
    });

    console.log(`END\tImporting table [${tableName}]\tJSON file ${jsonFile}.`);
}

/**
 * This method loads the create table commands and issues them to the database if the table does not already exist
 * 
 * @param db sqlite.Database object
 * @param importFile The .sql file containing CREATE TABLE commands
 * @returns void
 */
export const initializeDatabase = (db: sqlite3.Database, importFile: string) => {
    console.log('BEGIN\tInitializing database.  This drops tables if they exist, and recreates them');
    const sql = fs.readFileSync(importFile, 'utf8');

    const statements = sql.split(';');

    db.serialize(() => {
        statements.forEach(statement => {
            const trimmed = statement.trim();
            if (!isNil(trimmed) && trimmed.startsWith('CREATE TABLE')) {
                const matched = trimmed.match(/CREATE TABLE (\S+)/);
                if(!isNil(matched) && matched.length > 1) {
                    const tableName = matched[1];
                    db.run(`DROP TABLE IF EXISTS ${tableName}`);
                }
                db.run(trimmed);
            }
        });
    });

    console.log('END\tInitializing database.  This drops tables if they exist, and recreates them');
}

/**
 * This method closes a database object
 * 
 * @param db sqlite.Database object
 * @returns void
 */
export const closeDatabaseConection = (db: sqlite3.Database) => {
    console.log('Closing the database connection')
    db.close()
}