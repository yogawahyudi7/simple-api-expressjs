const express = require("express");
const app = express();
const bodyParser = require("body-parser");
const db = require("./database");
const response = require("./response");
const port = 3000;

app.use(bodyParser.json()); // for parsing application/json

// test connect db
db.connect((err) => {
  if (err) {
    throw err;
  }

  console.log("Connected!");
});

// ROOT ROUTE
app.get("/", (req, res) => {
  response(res, 200, "Welcome to my API!");
});

// GET ALL MAHASISWA
app.get("/mahasiswa", (req, res) => {
  db.query(
    "SELECT * FROM mahasiswa WHERE deleted_at IS NULL",
    (err, results) => {
      if (err) return response(res, 500, err.sqlMessage);

      if (results.length > 0) {
        return response(res, 200, results);
      } else {
        return response(res, 404, results);
      }
    }
  );
});

// GET MAHASISWA BY ID
app.get("/mahasiswa/:id", (req, res) => {
  id = req.params.id;

  sql = "SELECT * FROM mahasiswa WHERE id = ? AND deleted_at IS NULL";
  db.query(sql, id, (err, results) => {
    if (err) return response(res, 500, err.sqlMessage);

    if (results.length > 0) {
      return response(res, 200, results);
    } else {
      return response(res, 404, results);
    }
  });
});

// ADD MAHASISWA
app.post("/mahasiswa", (req, res) => {
  const { nim, name, age, address } = req.body;

  sql =
    "INSERT INTO mahasiswa (nim, name, age, address, created_at, updated_at) VALUES (?, ?, ?, ?, ?, ?)";
  db.query(
    sql,
    [nim, name, age, address, new Date(), new Date()],
    (err, results) => {
      if (err) {
        if (err.errno === 1062) {
          response(res, 409, "Duplicate entry");
          return;
        } else {
          response(res, 500, "Internal server error");
          return;
        }
      }
      if (results.affectedRows) {
        response(res, 200, results);
      } else {
        response(res, 500, results);
      }
    }
  );
});

// UPDATE MAHASISWA
app.put("/mahasiswa/:id", (req, res) => {
  const id = req.params.id;
  const { nim, name, age, address } = req.body;

  sql =
    "UPDATE mahasiswa SET nim = ?, name = ?, age = ?, address = ?, updated_at = ? WHERE id = ? AND deleted_at IS NULL";
  db.query(sql, [nim, name, age, address, new Date(), id], (err, results) => {
    if (err) {
      response(res, 500, err.sqlMessage);
      return;
    }
    if (results.affectedRows) {
      response(res, 200, results);
    } else {
      response(res, 404, results);
    }
  });
});

// SOFT DELETE MAHASISWA
app.delete("/mahasiswa/:id", (req, res) => {
  const id = req.params.id;

  sql =
    "UPDATE mahasiswa SET deleted_at = ? WHERE id = ? AND deleted_at IS NULL";
  db.query(sql, [new Date(), id], (err, results) => {
    if (err) {
      response(res, 500, err.sqlMessage);
      return;
    }
    if (results.affectedRows) {
      response(res, 200, results);
    } else {
      response(res, 404, results);
    }
  });
});

app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`);
});
