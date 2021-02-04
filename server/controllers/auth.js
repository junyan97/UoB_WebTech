module.exports = {
   authenticate
};

function authenticate(req, res, next) {
   const { authorization } = req.headers;
   const { db, jwt } = req;
   
   if (!authorization) return error(res, "Token not found");

   let stmt = db.prepare(
      'SELECT COUNT(1) AS c FROM UserToken WHERE token LIKE ?'
   );

   stmt.get(authorization, (err, row) => {
      stmt.finalize();
      if (err) {
         console.error(err);
         return error(res, "SQLite error code: " + err);
      }
      
      if (row['c'] > 0) {
         try {
            const decoded = jwt.verify(authorization, 'JWT_SECRET_KEY');
            req.userId = decoded.userId;
            return next();
         } catch(err) {
            // remove expired token            
            stmt = db.prepare(
               'DELETE FROM UserToken WHERE token = ?'
            );
            stmt.get(authorization, (err, row) => {
               stmt.finalize();
               if (err) {
                  console.error(err);
                  return error(res, "SQLite error code: " + err);
               }
            });
         }
      }
      return error(res, "Not authorized");
   });   
}

function error(res, msg) {
   return res.status(500).json({
      "error": msg
   });
}