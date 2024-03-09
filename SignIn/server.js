const express = require('express');
const path = require('path');
const sql = require('msnodesqlv8');
const bodyParser = require('body-parser');

const app = express();
var connectionString = "server=DESKTOP-LT7G6FF\\SQLEXPRESS;Database=MealPlanner;Trusted_Connection=Yes;Driver={SQL Server}";

app.use(express.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

const signInPath = path.join(__dirname, '..','SignIn');
app.use(express.static(path.join(signInPath)));

app.post('/signin', (req, res) => {
  console.log(req.body);
  const { email, password } = req.body;
  console.log('Received data:', email, password);

  const query = `SELECT * FROM Users WHERE UserEmail = '${email}' AND UserPassword = '${password}'`;

  sql.query(connectionString, query, (err, rows) => {
    if (err) {
      console.log('Error:', err);
      res.status(500).json({ error: 'An error occurred while signing in.' });
    } else {
      if (rows.length > 0) {
        console.log('User signed in successfully');
        res.redirect('http://localhost:3001');
      } else {
        console.log('Invalid email or password');
        res.status(401).json({ error: 'Invalid email or password.' });
      }
    }
  });
});


app.get('/', (req, res) => {
  res.redirect('/signin');
});

app.get('/signin', (req, res) => {
  res.sendFile(path.join(signInPath, 'signin.html'));
});

app.listen(3000, () => {
  console.log('Server is running on http://localhost:3000');
});
