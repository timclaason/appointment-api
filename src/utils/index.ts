import path from 'path'; 

/**
 * A function to detect the location of the /src directory.  Not an ideal solution, but I 
 * struggled with the moving target of the Sqlite database file
 * 
 * @returns string representation of the /src directory
 */
export const getSourceDirectory = (): string => {
    return path.join(__dirname, '..', '..', 'src')
}
