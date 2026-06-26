const cors = require("cors");
const express = require("express");
const multer = require("multer");
const sqlite3 = require("sqlite3").verbose();
const app = express();
const path = require("path");

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/');
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + path.extname(file.originalname));
  }
});

const upload = multer({ storage: storage });

app.use(cors());
app.use(express.json());
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

const database = new sqlite3.Database("./database.db");
database.run("CREATE TABLE IF NOT EXISTS records(id INTEGER PRIMARY KEY, content TEXT, image_path TEXT, created_at DATETIME DEFAULT CURRENT_TIMESTAMP)");

app.get("/records", (req, res) => {
  database.all("SELECT * FROM records ORDER BY created_at DESC", [], (err, rows) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json(rows);
  });
});

app.post("/messages", upload.single('image'), (req, res) => {
  const { content } = req.body;
  const imagePath = req.file ? `/uploads/${req.file.filename}` : null;

  database.run("INSERT INTO records(content, image_path) VALUES (?, ?)", [content, imagePath], (err) => {
    if (err) return res.status(500).json({ error: err.message });
    res.status(201).send({ status: "Success" });
  });
});

app.listen(3000, () => console.log("Server running on port 3000"));