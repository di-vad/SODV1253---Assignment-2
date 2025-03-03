import React from "react";
import { Link } from "react-router-dom";

const RecipeList = ({ recipes, category }) => {
  const filteredRecipes = recipes.filter((recipe) =>
    category ? recipe.strCategory === category : true
  );

  return (
    <div>
      {filteredRecipes.length === 0 ? (
        <p>No recipes found</p>
      ) : (
        <ul>
          {filteredRecipes.map((recipe) => (
            <li key={recipe.idMeal}>
              <Link to={`/recipe/${recipe.idMeal}`}>
                <img
                  src={recipe.strMealThumb}
                  alt={recipe.strMeal}
                  width="100"
                />
                <h3>{recipe.strMeal}</h3>
              </Link>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default RecipeList;
