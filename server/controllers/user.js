module.exports = {
   emailAvailability
   , register
   , login
   , logout
   , updateProfile
};

function emailAvailability(req, res) {
   const { body, db } = req;
   if (isNullOrEmpty(body.email)) {
      return error(res, "Request JSON provided is not as expected");
   }
   
   let stmt = db.prepare(
      'SELECT COUNT(1) AS c FROM User WHERE email = ?'
   );

   stmt.get(body.email, (err, row) => {
      stmt.finalize();
      if (err) {
         console.error(err);
         return error(res, "SQLite error code: " + err);
      }

      let availability = (row['c'] > 0) ? false : true;
      return success(res, {
         "emailAvailable": availability
      }); 
   });
}

function register(req, res) {   
   const { body, db, bcrypt, saltRounds } = req;
   if (isNullOrEmpty(body.email) || isNullOrEmpty(body.password) || 
      isNullOrEmpty(body.firstName) || isNullOrEmpty(body.lastName))
   {
      return error(res, "Request JSON provided is not as expected");
   }

   let stmt = db.prepare(
      'SELECT COUNT(1) AS c FROM User WHERE email = ?'
   );
   
   stmt.get(body.email, (err, row) => { 
      stmt.finalize();  
      if (err) {
         console.error(err);
         return error(res, "SQLite error code: " + err);         
      }
      if (row['c'] > 0) {         
         return error(res, "Email already exists");         
      }
            
      const pwHash = bcrypt.hashSync(body.password, saltRounds);
      stmt = db.prepare(
         'INSERT INTO User (email, password, nameFirst, nameLast) VALUES (?,?,?,?)'
      );
      stmt.run(body.email, pwHash, body.firstName, body.lastName);
      stmt.finalize((err) => {
         if (err) {
            console.error(err);
            return error(res, "SQLite error code: " + err);
         }
         return success(res, {         
            "response": "OK"
         });
      });
   });
}

function login(req, res) {
   const { body, db, bcrypt, jwt } = req;
   if (isNullOrEmpty(body.email) || isNullOrEmpty(body.password)) {
      return error(res, "Request JSON provided is not as expected");
   }

   let stmt = db.prepare(
      'SELECT * FROM User WHERE email = ?'
   );

   stmt.get(body.email, (err, row) => {
      stmt.finalize();
      if (err) {
         console.error(err);
         return error(res, "SQLite error code: " + err);
      }

      if (row && bcrypt.compareSync(body.password, row.password)) {
         createSession(db, jwt, row.id)
         .then((token) => {
            return success(res, {
               token: token
               , userId: row.id
               , email: row.email
               , firstName: row.nameFirst
               , lastName: row.nameLast               
            });
         })
         .catch((err) => {
            return error(res, "SQLite error code: " + err);
         });
      } else {
         return error(res, "Invalid email/password");
      }
   });
}

function logout(req, res) {
   const { authorization } = req.headers;
   const { db } = req;

   let stmt = db.prepare(
      'DELETE FROM UserToken WHERE token = ?'
   );
   stmt.run(authorization);

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

function updateProfile(req, res) {
   const { body, db, userId } = req;
   if (isNullOrEmpty(body.firstName) || isNullOrEmpty(body.lastName)) {
      return error(res, "Request JSON provided is not as expected");
   }
   
   let stmt = db.prepare(
      'UPDATE User SET nameFirst = ?, nameLast = ? WHERE id = ?'
   );
   stmt.run(body.firstName, body.lastName, userId);

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

function createSessionToken(jwt, userId) {
   const token = jwt.sign({userId: userId, timestamp: new Date()}, 'JWT_SECRET_KEY', { expiresIn: '1h'});
   return token;
}

// could use KV store like Redis or store claims used to construct JWT instead
function createSession(db, jwt, userId) {
   return new Promise((resolve, reject) => {
      const token = createSessionToken(jwt, userId);
      stmt = db.prepare(
         'INSERT INTO UserToken (userId, token) VALUES (?,?)'
      );
      stmt.run(userId, token);
      stmt.finalize((err) => {
         if (err) {
            console.error(err);
            return reject(err);
         }
         return resolve(token);
      });
   });
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