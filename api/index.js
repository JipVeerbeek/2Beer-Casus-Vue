const express = require("express");
const app = express();
const mysql = require("mysql");
const cors = require("cors");
const bodyParser = require("body-parser");
const bcrypt = require("bcryptjs");
const jwt = require('jsonwebtoken');
require("dotenv").config({ path: "../.env" });

// enable cors
app
  .use(cors())
  .use(bodyParser.json())
  .use(bodyParser.urlencoded({ extended: true }));

// create connection to database (you can use this for single queries)
const pool = mysql.createPool({
  connectionLimit: 10,
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
});



// verify the token
let verifyToken = (req, res, next) => {
  let token = req.headers['x-access-token'];
  if (!token) return res.status(401).send({ auth: false, message: 'No token provided.' });

  jwt.verify(token, process.env.JWT_SECRET, function (err, decoded) {
    if (err) return res.status(500).send({ auth: false, message: 'Failed to authenticate token.' });

    // if everything good, save to request for use in other routes
    req.userId = decoded.id;
    next();
  });
}


// get all beers or a specific beer
app.get("/:id", (req, res) => {
  pool.getConnection((err, connection) => {
    if (err) { res.send(err); return; }

    let query = "SELECT id, name, brewer, type, yeast, perc, purchase_price, like_count from beers WHERE deleted_at IS NULL";
    // check if the id is a number, if not, return all beers, else return the beer with the id
    
    if (!isNaN(req.params.id)) {
      query += " AND id = " + req.params.id;
    }

    connection.query(query, (err, rows) => {
      connection.release(); // return the connection to pool

      if (!err) {
        res.send(rows);
      } else {
        res.send(err);
      }
    });
  });
});

// add a beer, params are name, brewer and type
app.post("/", verifyToken, (req, res) => {
  pool.getConnection((err, connection) => {
    if (err) { res.send(err); return; }

    let query = "INSERT INTO beers SET ?";
    
    // check if all 3 params are set in the req.body object
    if (
      req.body.name === undefined ||
      req.body.brewer === undefined ||
      req.body.type === undefined
    ) {
      res.status(422).send("Missing param(s)");
      return;
    }

    let params = {
      name: req.body.name,
      brewer: req.body.brewer,
      type: req.body.type,
      yeast: req.body.yeast || null,
      perc: req.body.perc || null,
      purchase_price: req.body.purchase_price || null,
      created_at: new Date(),
      updated_at: new Date(),
    };

    connection.query(
      query,
      params,
      (err, test) => {
        connection.release(); // return the connection to pool
        if (err) {
          res.send(err);
        } else {
          res.send(test);
        }
      }
    );
  });
});

// update a beer, params are id, name, brewer and type
app.patch("/:id", verifyToken, (req, res) => {
  pool.getConnection((err, connection) => {
    if (err) { res.send(err); return; }
  
    // check if all 4 params are set in the req.body object
    if (
      req.params.id === undefined ||
      req.body.name === undefined ||
      req.body.brewer === undefined ||
      req.body.type === undefined
    ) {
      res.status(422).send("Missing param(s)");
      return;
    }

    let params = {
      name: req.body.name,
      brewer: req.body.brewer,
      type: req.body.type,
      yeast: req.body.yeast || null,
      perc: req.body.perc || null,
      purchase_price: req.body.purchase_price || null,
      updated_at: new Date(),
    };

    // set the new values in the database with the correct id
    let query = "UPDATE beers SET name = ?, brewer = ?, type = ?, yeast = ?, perc = ?, purchase_price = ?, updated_at = ? WHERE id = ?";
    connection.query(
      query,
      [params.name, params.brewer, params.type, params.yeast, params.perc, params.purchase_price, params.updated_at, req.params.id],
      (err, rows) => {
        connection.release(); // return the connection to pool
        if (err) {
          res.send(err);
        } else {
          res.send(rows);
        }
      }
    );
  });
});


// Delete beer
app.delete('/:id', verifyToken, (req, res) => {
  pool.getConnection((err, connection) => {
    if (err) { res.send(err); return; }

    if (!isNaN(req.params.id)) {
      let query = "DELETE FROM beers WHERE id = '" + req.params.id + "'";

      connection.query(query, (err, rows) => {
        connection.release(); // return the connection to pool
  
        if (!err) {
          res.send(rows);
        } else {
          res.send(err);
        }
      });
    }
    else {
      res.status(422).send("missing id");
    }
  });

    
});


// allow user to make an account
app.post('/user/signup', (req, res) => {
  pool.getConnection((err, connection) => {
    if (err) { res.send(err); return; }

    let query = "INSERT INTO users SET ?";

    if (
      req.body.name === undefined ||
      req.body.password === undefined ||
      req.body.email === undefined
    ) {
      res.status(422).send("Missing param(s)");
      return;
    }

    // salting and hashing the password for security
    let salt = bcrypt.genSaltSync(10);
    let hashPassword = bcrypt.hashSync(req.body.password, salt);

    let params = {
      name: req.body.name,
      password: hashPassword,
      email: req.body.email,
      created_at: new Date(),
      updated_at: new Date(),
      email_verified_at: new Date(),
    };

    connection.query(
      query,
      params,
      (err, rows) => {
        
        if (err) {
          // if the email already exists, send a 409 error
          if (err.errno == 1062) {
            res.status(409).send("Email already exists");
          } else {
            res.send(err);
          }
        } else {
          // if the creation is successful, send the user's id and a token
          let token = jwt.sign({ id: rows.insertId }, process.env.JWT_SECRET, {
            expiresIn: process.env.JWT_EXPIRES_IN // expires in 24 hours
          });

          connection.query(
            // get user's name
            "SELECT name FROM users WHERE id = ?",
            [rows.insertId],
            (err, rows) => {
              connection.release(); // return the connection to pool
              console.log(rows);
              if (err) { res.send(err); return; }

              let name = rows[0].name;
              res.send({ auth: true, token: token, data: { name: name }});
            }
          );
        }
      }
    );
  })
});

// allow user to login
app.post('/user/login', (req, res) => {
  pool.getConnection((err, connection) => {
    if (err) { res.send(err); return; }

    let query = "SELECT * FROM users WHERE email = ?";

    if (
      req.body.email === undefined ||
      req.body.password === undefined
    ) {
      res.status(422).send("Missing param(s)");
      return;
    }

    connection.query(
      query,
      [req.body.email],
      (err, rows) => {
        connection.release(); // return the connection to pool

        if (err) {
          res.send(err);
        } else {
          // if the email exists, check if the password is correct
          if (rows.length > 0) {
            if (bcrypt.compareSync(req.body.password, rows[0].password)) {
              // if the password is correct, create a token and send it back to the user
              let token = jwt.sign({ id: rows.insertId }, process.env.JWT_SECRET, {
                expiresIn: process.env.JWT_EXPIRES_IN // expires in 24 hours
              });

              let name = rows[0].name;
              res.send({ auth: true, token: token, data: { name: name }});
            } else {
              res.status(401).send("Wrong password");
            }
          } else {
            res.status(404).send("Email not found");
          }
        }
      }
    );
  })
});

app.listen(3000, () => {
  console.log("Server is listening on port 3000");
});
