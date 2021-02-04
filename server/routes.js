const rootApiUri = "/api"; // API begins with this
const statApiUri = "/stat";
const userApiUri = "/user";

const authController = require("./controllers/auth");
const statController = require("./controllers/stat");
const userController = require("./controllers/user");

module.exports = function (app, express, path, rootDir) {
   app.post(rootApiUri + userApiUri + "/emailavailability", userController.emailAvailability);
   app.post(rootApiUri + userApiUri + "/register", userController.register);
   app.post(rootApiUri + userApiUri + "/login", userController.login);
   app.get(rootApiUri + userApiUri + "/logout", isAuthorized, userController.logout);
   app.put(rootApiUri + userApiUri + "/updateprofile", isAuthorized, userController.updateProfile);
   app.get(rootApiUri + statApiUri + "/getallcountries", isAuthorized, statController.getAllCountries);
   app.delete(rootApiUri + statApiUri + "/deletecountry", isAuthorized, statController.deleteCountry);
   app.use(express.static(rootDir));
   app.get("*", (req, res) => {   
      res.sendFile(path.join(rootDir, 'index.html'));
   });
};

function isAuthorized(req, res, next) {
   authController.authenticate(req, res, next);
}