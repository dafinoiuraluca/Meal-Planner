const express = require('express');
const path = require('path');
const sql = require('msnodesqlv8');
const bodyParser = require('body-parser');

const app = express();
var connectionString = "server=DESKTOP-LT7G6FF\\SQLEXPRESS;Database=MealPlanner;Trusted_Connection=Yes;Driver={SQL Server}";

app.use(express.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

const recipePath = path.join(__dirname, '..','Newrecipe');
app.use(express.static(path.join(recipePath)));

app.post('/newrecipe', (req, res) => {
  console.log(req.body);
  const { recipeName, recipeDescription, portions } = req.body;
  console.log('Received data:', recipeName, recipeDescription, portions);

  const query = `INSERT INTO Recipes (RecipeName, RecipeDescription, Portions) VALUES ('${recipeName}', '${recipeDescription}', '${portions}')`;
  
  sql.query(connectionString, query, (err, rows) => {
    if (err) {
      console.log('Error:', err);
      res.status(500).json({ error: 'An error occurred while adding.' });
      return;
    }

    console.log('Added successfully');
    res.status(200).json({ message: 'Added successfully.' });
  });
});



app.get('/', (req, res) => {
  res.redirect('/newrecipe');
});

app.get('/newrecipe', (req, res) => {
  res.sendFile(path.join(recipePath, 'newrecipe.html'));
});

app.listen(3003, () => {
  console.log('Server is running on http://localhost:3003');
});