async function dbConnector(req, res){
    let connection;
    const { type, hostname, username, password, database, serviceName } = req.body;
  if (type === 'mysql') {
    const mysql = require('mysql2');
    connection = mysql.createConnection({
      host: hostname,
      user: username,
      password: password,
      database: database,
    });
  } else if (type === 'mongodb') {
    const MongoClient = require('mongodb').MongoClient;
    MongoClient.connect(database, { useNewUrlParser: true, useUnifiedTopology: true, serverSelectionTimeoutMS: 5000 }).then(async (db) => {
        const client = db.db("FMSI-CARDS");
        connection = await client.collection("databases").insertOne({
            type: type,
            connection: database
        });
        res.send(200);
    }).catch((err) => console.log(err));
  } else if (type === 'postgres') {
    const { Client } = require('pg');
    connection = new Client({
      host: hostname,
      user: username,
      password: password,
      database: database,
    });
  } else if (type === 'oracle') {
    const oracledb = require('oracledb');
    connection = oracledb.getConnection({
      user: username,
      password: password,
      connectString: `${hostname}/${serviceName}`,
    });
  }
}

async function fetchConnection(req, res){
    const MongoClient = require('mongodb').MongoClient;
    MongoClient.connect("mongodb+srv://grad-proj:grad-proj-123@cluster1.1aizeuk.mongodb.net/test", { useNewUrlParser: true, useUnifiedTopology: true, serverSelectionTimeoutMS: 5000 }).then(async (db) => {
        const client = db.db("FMSI-CARDS");
        client.collection("databases").findOne({status: "connected"}).then((results, err) => {
            if (err) console.log(err);
            console.log(results)
            res.send(results);
        });
    }).catch((err) => console.log(err));
}

module.exports = {dbConnector, fetchConnection}