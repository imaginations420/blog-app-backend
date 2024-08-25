const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const db = require('./database'); // Import the database connection

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(bodyParser.json());

// Get all posts
app.get('/posts', (req, res) => {
    const sql = 'SELECT * FROM posts';
    db.all(sql, [], (err, rows) => {
        if (err) {
            res.status(400).json({ error: err.message });
            return;
        }
        res.json({
            message: 'success',
            data: rows
        });
    });
});

// Get a specific post by ID
app.get('/posts/:id', (req, res) => {
    const { id } = req.params;
    const sql = 'SELECT * FROM posts WHERE id = ?';
    db.get(sql, [id], (err, row) => {
        if (err) {
            res.status(400).json({ error: err.message });
            return;
        }
        if (!row) {
            res.status(404).json({ message: 'Post not found' });
            return;
        }
        res.json({
            message: 'success',
            data: row
        });
    });
});

// Create a new post
app.post('/posts', (req, res) => {
    const { title, content } = req.body;
    const sql = 'INSERT INTO posts (title, content) VALUES (?, ?)';
    db.run(sql, [title, content], function (err) {
        if (err) {
            res.status(400).json({ error: err.message });
            return;
        }
        res.json({
            message: 'success',
            data: { id: this.lastID, title, content }
        });
    });
});

// Update a post by ID
app.put('/posts/:id', (req, res) => {
    const { id } = req.params;
    const { title, content } = req.body;
    const sql = 'UPDATE posts SET title = ?, content = ? WHERE id = ?';
    db.run(sql, [title, content, id], function (err) {
        if (err) {
            res.status(400).json({ error: err.message });
            return;
        }
        res.json({
            message: 'success',
            data: { id, title, content },
            changes: this.changes
        });
    });
});

// Delete a post by ID
app.delete('/posts/:id', (req, res) => {
    const { id } = req.params;
    const sql = 'DELETE FROM posts WHERE id = ?';
    db.run(sql, id, function (err) {
        if (err) {
            res.status(400).json({ error: err.message });
            return;
        }
        res.json({
            message: 'success',
            changes: this.changes
        });
    });
});

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
