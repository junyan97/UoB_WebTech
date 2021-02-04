const sqlCreateDb = require("./sqlCreateDb");
const sqlInsertDb = require("./sqlInsertDb");
const dbFileName = "data.db";

module.exports = {
   getDb
};

function getDb(sqlite, csvParser, fs, path) {
   return new Promise(async (resolve, reject) => {
      let db;
      const dbFilePath = path.join(__dirname, dbFileName);
      if (fs.existsSync(dbFilePath)) {
         db = new sqlite.Database(dbFilePath);
         resolve(db);
      } else {
         console.log("Creating DB, please wait..");
         db = new sqlite.Database(dbFilePath);
         await sqlCreateDb.execute(db);
         await sqlInsertDb.execute(db, csvParser, path);
         console.log("DB created successfully.");
         resolve(db);
      } 
   });
};
