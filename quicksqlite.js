import sqlite3 from 'sqlite3'
import { open } from 'sqlite'

sqlite3.verbose()

// you would have to import / invoke this in another file
export async function openDb () {
  return open({
    filename: 'test.db',
    driver: sqlite3.Database
  })
}

const db = await openDb();


await db.exec('DROP TABLE tbl')
await db.exec('CREATE TABLE tbl (col TEXT)')
await db.exec('INSERT INTO tbl VALUES ("test")')
const result = await db.get('SELECT col FROM tbl WHERE col = ?', 'test')

console.log("result", result)
