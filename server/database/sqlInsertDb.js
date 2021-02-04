const dataCsvFile = "data.csv";
let csvFieldArr = ["Province/State", "Country/Region", "Lat", "Long", "Date", "Confirmed", "Deaths", "Recovered"];

module.exports = {
   execute
};

function execute(db, csvParser, path) {
   return new Promise((resolve, reject) => {
      const csvFilePath = path.join(__dirname, dataCsvFile);
      csvParser()
      .fromFile(csvFilePath)
      .then((dataJsonArray) => {
         db.serialize(() => {
            insertStatUpdate(db, dataJsonArray, resolve);
         });
      });
   });
}

function insertStatUpdate(db, dataJsonArray, resolve) {
   let countryTable = {};
   let countryCounter = 1, countryId;
   let countryName = '';
   let stmt = db.prepare(
      'INSERT INTO StatUpdate (countryId, date, confirmed, deaths, recovered) VALUES (?,?,?,?,?)'
   );
   
   for (let i = 0; i < dataJsonArray.length; i++) {
      let dataJson = dataJsonArray[i];
      dataJson[csvFieldArr[5]].replace("2020", "20");
      countryName = dataJson[csvFieldArr[1]];

      if (!countryTable[countryName]) {
         let countryStmt = db.prepare(
            'INSERT INTO Country (id, name) VALUES (?,?)'
         );
         countryStmt.run(countryCounter, countryName);
         countryStmt.finalize();         
         countryTable[countryName] = countryCounter++;         
      }

      countryId = countryTable[countryName];

      stmt.run(         
         countryId
         , dataJson[csvFieldArr[4]]
         , parseInt(dataJson[csvFieldArr[5]])
         , parseInt(dataJson[csvFieldArr[6]])
         , parseInt(dataJson[csvFieldArr[7]])
      );      
   }
   stmt.finalize((err) => {
      resolve();
   });
}