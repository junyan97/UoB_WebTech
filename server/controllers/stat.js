module.exports = {
   getAllCountries,
   deleteCountry
};

function getAllCountries(req, res) {
   const { db } = req;
   let stmt = db.prepare(
      'SELECT su.date AS Date, su.confirmed AS Confirmed, su.deaths AS Deaths, su.recovered AS Recovered' +
      ' , c.name AS Country FROM StatUpdate AS su INNER JOIN Country AS c ON su.countryId = c.id'
   );
   
   stmt.all((err, rows) => {
      if (err) {
         return error(res, "Unable to retrieve data at the moment");
      }
      return success(res, mergeStatCountry(rows));
   });
};

function deleteCountry(req, res) {
   const { db, body } = req;
   if (isNullOrEmpty(body.countryId)) {
      return error(res, "Request JSON provided is not as expected");
   }

   let stmt = db.prepare(
      'DELETE FROM StatUpdate WHERE countryId = ?'
   );
   stmt.run(body.countryId);

   stmt.finalize((err) => {
      if (err) {
         console.error(err);
         return error(res, "SQLite error code: " + err);
      }
      return success(res, {         
         "response": "OK"
      });
   });
}

function mergeStatCountry(rows) {   
   let processedRows = [];
   let currDate = rows[0].Date;   
   let dateCountriesObj = {};

   for(let i = 0; i < rows.length; i++) {
      let obj = rows[i];
      if (currDate.localeCompare(obj.Date) == 0) {
         if (!dateCountriesObj[obj.Country]) {
            dateCountriesObj[obj.Country] = JSON.parse(JSON.stringify(obj));
         } else {
            dateCountriesObj[obj.Country].Confirmed += obj.Confirmed;
            dateCountriesObj[obj.Country].Deaths += obj.Deaths;
            dateCountriesObj[obj.Country].Recovered += obj.Recovered;
         }
      } else {
         for (let key of Object.keys(dateCountriesObj)) {            
            processedRows.push(dateCountriesObj[key]);     
        }
        dateCountriesObj = {};
        dateCountriesObj[obj.Country] = JSON.parse(JSON.stringify(obj));
        currDate = obj.Date;
      }
      if (i == rows.length - 1) {
         for (let key of Object.keys(dateCountriesObj)) {
            processedRows.push(dateCountriesObj[key]);     
        }
      }
   }
   return processedRows;
}

function isNullOrEmpty(str) {
   // check whether is string first   
   if (!Object.prototype.toString.call(str) === '[object String]') return true;

   return (!str || str.length < 1);
}

function error(res, msg) {
   return res.status(500).json({
      "error": msg
   });
}

function success(res, json) {
   return res.status(200).json(json);
}