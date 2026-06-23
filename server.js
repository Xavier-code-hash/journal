const cors = require("cors");
const express = require("express");
const sqlite3 = require("sqlite3").verbose();
const app = express();

app.use(cors())
app.use(express.json());
const database = new sqlite3.Database("./database.db");
database.run("CREATE TABLE IF NOT EXISTS records(id INTEGER PRIMARY KEY, content TEXT)");

app.get("/records", (req, res) => {
  database.all("SELECT * FROM records",
    [], (errorMessage, rows) =>{
      res.json(rows);
    });
});

app.post("/messages", (req, res) =>{
  const {content} = req.body;
  database.run("INSERT INTO records(content) VALUES (?)", [content]);
  res.send({status: "Uploaded successfully"});
});

app.listen(3000, ()=>{console.log("Local server is running")});
