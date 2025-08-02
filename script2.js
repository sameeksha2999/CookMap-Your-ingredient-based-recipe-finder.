
let result = document.getElementById("result");
let searchBtn = document.getElementById("search-btn");
let url = " http://127.0.0.1:5000/get_recipes";

searchBtn.addEventListener("click", () => {
  result.innerHTML = "";
  let userInp = document.getElementById("user-inp").value;
  if (userInp.length == 0) {
    result.innerHTML = `<h3>Input Field Cannot Be Empty</h3>`;
  } else {
    fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ ingredients: userInp }),
    })
      .then((response) => response.json())
      .then((data) => {
        data.forEach((recipe) => {
          var ingredients = recipe.extendedIngredients;
          var ingredientList = "";
          ingredients.forEach((ingredient) => {
            ingredientList += `<li>${ingredient.name}</li>`;
          });

          result.innerHTML += `<div class="recipe-item">
          <img src=${recipe.image}>
          <div class="details">
              <h2>${recipe.title}</h2>
              <h4>${recipe.vegetarian ? "Vegetarian" : "Non-Vegetarian"}</h4>
          </div>
          <div id="ingredient-con">
          <ul>
          ${ingredientList}
          </ul>
          <br>
          <p class="text-center">Cooking Time: <b> ${recipe.readyInMinutes} </b>minutes</p>
          <p class="text-center">Servings: <b>${recipe.servings} </b></p>
          </div>
          <div id="recipe">
              <button class="hide-recipe">X</button>
              <pre id="instructions">
                 <p>${recipe.instructions}</p>
                 <p class="text-center">Source: <a href="${recipe.sourceUrl}">${
            recipe.sourceUrl
          }</a></p>
                 </pre>
          </div>
          <button class="show-recipe">View Recipe</button>
          </div>
          `;
        });

        var recipe = document.getElementById("recipe");
        // Select all elements with the class "hide-recipe" and "show-recipe"
        var hideButtons = document.querySelectorAll(".hide-recipe");
        var showButtons = document.querySelectorAll(".show-recipe");

        // Iterate over all hide buttons and add the "click" event listener
        hideButtons.forEach((hideButton) => {
          hideButton.addEventListener("click", (event) => {
            // Find the closest recipe container to hide
            var recipeDiv = hideButton
              .closest(".recipe-item")
              .querySelector("#recipe");
            if (recipeDiv) {
              recipeDiv.style.display = "none";
            }
          });
        });

        // Iterate over all show buttons and add the "click" event listener
        showButtons.forEach((showButton) => {
          showButton.addEventListener("click", (event) => {
            // Find the closest recipe container to show
            var recipeDiv = showButton
              .closest(".recipe-item")
              .querySelector("#recipe");
            if (recipeDiv) {
              recipeDiv.style.display = "block";
            }
          });
        });

      })
      .catch(() => {
        result.innerHTML = `<h3>Invalid Input</h3>`;
      });
  }
});

