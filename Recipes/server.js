const express = require('express');
const path = require('path');
const sql = require('msnodesqlv8');

const app = express();
var connectionString = "server=DESKTOP-LT7G6FF\\SQLEXPRESS;Database=MealPlanner;Trusted_Connection=Yes;Driver={SQL Server}";

const recipesPath = path.join(__dirname, '..', 'Recipes');
app.use(express.static(path.join(recipesPath)));

app.get('/recipes', (req, res) => {
  const query = "SELECT RecipeName, RecipeDescription, Portions FROM Recipes";

  sql.query(connectionString, query, (err, rows) => {
    if (err) {
      console.log('Error:', err);
      res.status(500).json({ error: 'An error occurred while fetching recipes.' });
    } else {
      console.log('Recipes fetched successfully');
      
      let html = `
        <!DOCTYPE html>
        <html>
        <head>
          <title>Recipes</title>
          <style>
            body {
              font-family: Arial, sans-serif;
              margin: 0;
              padding: 20px;
              background-color: #f2f2f2;
            }
        
            h1 {
              color: #333;
            }
        
            #recipes-table {
              border-collapse: collapse;
              width: 100%;
              margin-top: 20px;
            }
        
            #recipes-table th,
            #recipes-table td {
              padding: 8px;
              text-align: left;
              border-bottom: 1px solid #ddd;
            }
        
            #recipes-table th {
              background-color: #f5f5f5;
            }
        
            #recipes-table tr:hover {
              background-color: #f9f9f9;
            }
            
            .search-bar {
              margin-bottom: 20px;
            }
            
            .search-bar input[type="text"] {
              padding: 6px;
              width: 200px;
            }
            
            .add-recipe-btn {
              float: right;
              margin-top: -40px;
              margin-right: 20px;
            }
          </style>
        </head>
        <body>
          <h1>Recipes</h1>
          <div class="search-bar">
            <input type="text" id="search-input" placeholder="Search recipes..." />
            <button onclick="searchRecipes()">Search</button>
          </div>
          <button class="add-recipe-btn" onclick="window.location.href = 'http://localhost:3003'">Add Recipe</button>
          <table id="recipes-table">
            <thead>
              <tr>
                <th>Name</th>
                <th>Description</th>
                <th>Portions</th>
              </tr>
            </thead>
            <tbody>`;

      rows.forEach((recipe) => {
        html += `
          <tr>
            <td>${recipe.RecipeName}</td>
            <td>${recipe.RecipeDescription}</td>
            <td>${recipe.Portions}</td>
          </tr>`;
      });

      html += `
          </tbody>
        </table>
        
        <script>
          function searchRecipes() {
            var input = document.getElementById('search-input');
            var filter = input.value.toLowerCase();
            var table = document.getElementById('recipes-table');
            var rows = table.getElementsByTagName('tr');
        
            for (var i = 0; i < rows.length; i++) {
              var recipeName = rows[i].getElementsByTagName('td')[0];
              var recipeDescription = rows[i].getElementsByTagName('td')[1];
              
              if (recipeName && recipeDescription) {
                var recipeNameText = recipeName.textContent || recipeName.innerText;
                var recipeDescriptionText = recipeDescription.textContent || recipeDescription.innerText;
                var recipeText = recipeNameText.toLowerCase() + recipeDescriptionText.toLowerCase();
                
                if (recipeText.indexOf(filter) > -1) {
                  rows[i].style.display = '';
                } else {
                  rows[i].style.display = 'none';
                }
              }
            }
          }
        </script>
        
        </body>
        </html>`;

      res.send(html);
    }
  });
});


app.get('/', (req, res) => {
  res.redirect('/recipes');
});

app.get('/recipes', (req, res) => {
  res.sendFile(path.join(recipesPath, 'recipes.html'));
});


app.listen(3001, () => {
  console.log('Server is running on http://localhost:3001');
});
