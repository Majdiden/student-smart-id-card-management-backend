// Function to retrieve the students from the database
function fetchStudents(req, res) {
  return new Promise( async (resolve, reject) => {
    switch (req.query.database) {
      case 'mysql':
        connection.query('SELECT * FROM students', (error, results) => {
          if (error) reject(error)
          res.send(results);
          resolve(results)
        })
        break
      case 'mssql':
        new mssql.Request(connection).query('SELECT * FROM students', (error, results) => {
          if (error) reject(error)
          resolve(results)
        })
        break
      case 'mongodb':
        const MongoClient = require('mongodb').MongoClient;
        MongoClient.connect(req.query.connectionString, { useNewUrlParser: true, useUnifiedTopology: true, serverSelectionTimeoutMS: 5000 }).then(async (client, err) => {
            const db = client.db("FMSI-CARDS");
            if (err) console.log(err)
            await db.collection('databases').find({type: 'mongodb'}).toArray((error, results) => {
              if (error) console.log(error)
              console.log(results)
              MongoClient.connect(results[0].connection, { useNewUrlParser: true, useUnifiedTopology: true, serverSelectionTimeoutMS: 5000 }).then(async (client2, err) => {
                console.log(client2)
                const stdb = client2.db("FMSI");
                console.log(db)
                if (err) console.log(err)
    
                await stdb.collection('students').find().toArray((error, students) => {
                  if (error) console.log(error)
                  res.send(students);
                  resolve(students)
                })
    
            }).catch((err) => {
                console.log(err)
            });
            })

        }).catch((err) => {
            console.log(err)
        });
        break
      default:
        reject(new Error('Invalid database type'))
    }
  })
}

module.exports = { fetchStudents }