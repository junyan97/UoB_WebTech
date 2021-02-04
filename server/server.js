// libraries
const express = require("express");
const bodyParser = require('body-parser');
const path = require("path");
const fs = require("fs");
const cors = require('cors');
const csvParser = require('csvtojson');
const sqlite = require("sqlite3");
const bcrypt = require('bcrypt');
const saltRounds = 10; // for bcrypt
const jwt = require('jsonwebtoken');

const sqlDbController = require(path.join(__dirname, "database", "sqlDbController"));
const config = require("./config");
const app = express();

const clientDir = path.join(__dirname, "..", "client");
const rootDir = path.join(clientDir, "build");
let db;

app.use(cors());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(lowercaseUrl);
app.use(addPropsToReq); //add libs and vars required to req object

require("./routes")(app, express, path, rootDir);

startServer();

async function startServer() {
    if (!fs.existsSync(rootDir) || !fs.existsSync(rootDir + "/index.html")) {
        console.error("Root directory or index.html is not found");
        process.exit(1);
    }

    db = await sqlDbController.getDb(sqlite, csvParser, fs, path);
    app.listen(config.port, config.host, () => { console.log("Server running at", config.domainName); });
}

function lowercaseUrl(req, res, next) {
    req.url = req.url.toLowerCase();
    next();
}

function addPropsToReq (req, res, next) {
    req.db = db;
    req.bcrypt = bcrypt;
    req.saltRounds = saltRounds;
    req.jwt = jwt;   
    next();
}
