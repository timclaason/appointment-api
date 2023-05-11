import sqlite3 from 'sqlite3'
import fs from 'fs';

// This method returns a usable database object for reading and writing to the database
export const getDatabaseObject = (databasePath: string): sqlite3.Database => {
    try {
        if (!fs.existsSync(databasePath)) {
            fs.writeFileSync(databasePath, '');
        }

        console.log('Opening database object', databasePath)
        sqlite3.verbose();
        return new sqlite3.Database(databasePath, sqlite3.OPEN_READWRITE);
    } catch(err) {
        console.log('Encountered error opening SQLite database', {err})
        throw err;
    }
}
