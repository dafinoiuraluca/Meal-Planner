const express = require('express');
const path = require('path');
const sql = require('msnodesqlv8');
const bodyParser = require('body-parser');

const app = express();
var connectionString = "server=DESKTOP-LT7G6FF\\SQLEXPRESS;Database=MealPlanner;Trusted_Connection=Yes;Driver={SQL Server}";

app.use(express.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

const signUpPath = path.join(__dirname, '..','SignUp');
app.use(express.static(path.join(signUpPath)));

app.post('/signup', (req, res) => {
  console.log(req.body);
  const { email, lastName, firstName, password } = req.body;
  console.log('Received data:', email, lastName, firstName, password);

  const query = `INSERT INTO Users (UserEmail, LastName, FirstName, UserPassword) VALUES ('${email}', '${lastName}', '${firstName}', '${password}')`;

  sql.query(connectionString, query, (err, rows) => {
    if (err) {
      console.log('Error:', err);
      res.status(500).json({ error: 'An error occurred while signing up.' });
    } else {
      console.log('User signed up successfully');
      res.redirect('http://localhost:3001');
    }
  });
});


app.get('/', (req, res) => {
    res.redirect('/signup');
  });

  app.get('/signup', (req, res) => {
    res.sendFile(path.join(signUpPath, 'signup.html'))
  });


app.listen(3002, () => {
  console.log('Server is running on http://localhost:3002');
});
