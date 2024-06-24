const express = require('express');
// const mysql = require('mysql');
const mysql = require('mysql2');
const cors = require('cors');

const app = express();
const port = 5000;

app.use(cors());
app.use(express.json()); // Replace bodyParser.json() with express.json()

// const db = mysql.createConnection({
//   host: 'localhost', // Remove port from here, it's not needed
//   user: 'root',
//   password: 'Vaibhav',
//   database: 'todo_database',
// });

const db = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: 'Pass@123',
    database: 'todo_database',
    authPlugins: {
      mysql_clear_password: () => () => Buffer.from('vaibhav1')
    }
  });

// Connect to MySQL
db.connect((err) => {
  if (err) {
    console.error('Error connecting to MySQL:', err);
    return;
  }
  console.log('MySQL connected...');
});

// Routes
app.get('/todos', (req, res) => {
  const sql = 'SELECT * FROM todos';
  db.query(sql, (err, results) => {
    if (err) {
      console.error('Error fetching todos:', err);
      res.status(500).json({ error: 'Error fetching todos' });
      return;
    }
    res.json(results);
  });
});

app.post('/todos', (req, res) => {
  const newTodo = { label: req.body.label, done: req.body.done };
  const sql = 'INSERT INTO todos SET ?';
  db.query(sql, newTodo, (err, result) => {
    if (err) {
      console.error('Error creating todo:', err);
      res.status(500).json({ error: 'Error creating todo' });
      return;
    }
    res.json({ id: result.insertId, ...newTodo });
  });
});

app.put('/todos/:id', (req, res) => {
  const { id } = req.params;
  const updatedTodo = { done: req.body.done };
  const sql = 'UPDATE todos SET ? WHERE id = ?';
  db.query(sql, [updatedTodo, id], (err, result) => {
    if (err) {
      console.error('Error updating todo:', err);
      res.status(500).json({ error: 'Error updating todo' });
      return;
    }
    res.json(result);
  });
});

app.delete('/todos/:id', (req, res) => {
  const { id } = req.params;
  const sql = 'DELETE FROM todos WHERE id = ?';
  db.query(sql, id, (err, result) => {
    if (err) {
      console.error('Error deleting todo:', err);
      res.status(500).json({ error: 'Error deleting todo' });
      return;
    }
    res.json(result);
  });
});

// Start server
app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
