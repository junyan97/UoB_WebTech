module.exports = {
   execute
};

function execute(db) {
   return new Promise((resolve, reject) => {
      db.serialize(() => {        
         createUser(db);
         createUserToken(db);
         createCountry(db);
         createStatUpdate(db, resolve);
      });      
   });
}

function createUser(db) {
   let stmt = db.prepare(
      `CREATE TABLE User (
         id INTEGER PRIMARY KEY AUTOINCREMENT
         , email VARCHAR(255) NOT NULL UNIQUE
         , password VARCHAR(255) NOT NULL    
         , nameFirst VARCHAR(255) NOT NULL
         , nameLast VARCHAR(255) NOT NULL
         , imagePath VARCHAR(2083)
         , createdAt INTEGER(4) NOT NULL DEFAULT (strftime('%s','now'))
         , updatedAt INTEGER(4) NOT NULL DEFAULT (strftime('%s','now'))
      )`
   );
   stmt.run();
   stmt.finalize();
}

function createUserToken(db) {
   let stmt = db.prepare(
      `CREATE TABLE UserToken (
         id INTEGER PRIMARY KEY AUTOINCREMENT
         , userId INTEGER NOT NULL 
         , token TEXT NOT NULL
         , createdAt INTEGER(4) NOT NULL DEFAULT (strftime('%s','now'))
         , updatedAt INTEGER(4) NOT NULL DEFAULT (strftime('%s','now'))
         , FOREIGN KEY (userId) REFERENCES User (id)
      )`
   );
   stmt.run();
   stmt.finalize();
}

function createCountry(db) {
   let stmt = db.prepare(
      `CREATE TABLE Country (
         id INTEGER PRIMARY KEY
         , name VARCHAR(255) NOT NULL UNIQUE
         , createdAt INTEGER(4) NOT NULL DEFAULT (strftime('%s','now'))
         , updatedAt INTEGER(4) NOT NULL DEFAULT (strftime('%s','now'))
      )`
   );
   stmt.run();
   stmt.finalize();
}

function createStatUpdate(db, resolve) {
   stmt = db.prepare(
      `CREATE TABLE StatUpdate (
         id INTEGER PRIMARY KEY AUTOINCREMENT    
         , countryId INTEGER NOT NULL
         , date VARCHAR(10) NOT NULL
         , confirmed INTEGER NOT NULL
         , deaths INTEGER NOT NULL
         , recovered INTEGER NOT NULL
         , createdAt INTEGER(4) NOT NULL DEFAULT (strftime('%s','now'))
         , updatedAt INTEGER(4) NOT NULL DEFAULT (strftime('%s','now'))
         , FOREIGN KEY (countryId) REFERENCES Country (id)
      )`
   );
   stmt.run();
   stmt.finalize((err) => {
      resolve();
   });
}
