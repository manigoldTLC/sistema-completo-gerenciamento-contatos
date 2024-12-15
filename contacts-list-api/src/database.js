import sqlite3 from 'sqlite3';

const db = new sqlite3.Database('./users.db', (err) => {
  if (err) {
	console.error(err.message);
	throw err;
  }
  console.log('Conectando ao bando de dados...');
});

db.serialize(() => {
	db.run(`
		CREATE TABLE IF NOT EXISTS users (
			id INTEGER PRIMARY KEY AUTOINCREMENT,
			name TEXT NOT NULL,
			email TEXT NOT NULL UNIQUE,
			phone TEXT NOT NULL
		)	
	`);
});

export default db;