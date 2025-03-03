import React, { useState, useEffect } from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import SearchBar from "./components/SearchBar";
import RecipeList from "./components/RecipeList";
import RecipeDetails from "./components/RecipeDetails";
import DietaryFilter from "./components/Filter";
import "./style.css";

const App = () => {
  const [recipes, setRecipes] = useState([]);
  const [category, setCategory] = useState("");
  const [searchQuery, setSearchQuery] = useState("");

  //get recipes
  const fetchRecipes = async (ingredients, selectedCategory) => {
    const ingredientList = ingredients
      ? ingredients.split(",").map((i) => i.trim())
      : [];

    let recipeMap = {};

    //get by category
    if (ingredientList.length === 0) {
      fetchRecipesByCategory(selectedCategory);
      return;
    }

    for (let ingredient of ingredientList) {
      try {
        const response = await fetch(
          `https://www.themealdb.com/api/json/v1/1/filter.php?i=${ingredient}`
        );
        const data = await response.json();
        recipeMap[ingredient] = data.meals
          ? data.meals.map((meal) => meal.idMeal)
          : [];
      } catch (error) {
        console.error(`Error fetching recipes for ${ingredient}:`, error);
        recipeMap[ingredient] = [];
      }
    }

    //common ingredient recipes
    const commonRecipeIDs = Object.values(recipeMap).reduce((a, b) =>
      a.filter((id) => b.includes(id))
    );

    //get the common ingredient recipe from api
    let commonRecipes = [];
    for (let id of commonRecipeIDs) {
      const response = await fetch(
        `https://www.themealdb.com/api/json/v1/1/lookup.php?i=${id}`
      );
      const data = await response.json();
      if (data.meals) {
        commonRecipes.push(data.meals[0]);
      }
    }

    //filter by category
    if (selectedCategory) {
      commonRecipes = commonRecipes.filter(
        (recipe) => recipe.strCategory === selectedCategory
      );
    }

    setRecipes(commonRecipes);
  };

  //fetching by category
  const fetchRecipesByCategory = async (selectedCategory) => {
    let url = selectedCategory
      ? `https://www.themealdb.com/api/json/v1/1/filter.php?c=${selectedCategory}`
      : `https://www.themealdb.com/api/json/v1/1/search.php?s=`;

    const response = await fetch(url);
    const data = await response.json();
    setRecipes(data.meals || []);
  };

  //useeffect with category as dependency array to refresh ui
  useEffect(() => {
    if (!searchQuery) {
      fetchRecipesByCategory(category || "");
    }
  }, [category]);

  return (
    <Router>
      <div>
        <h1>Recipe Finder</h1>
        <SearchBar
          onSearch={(query) => {
            setSearchQuery(query);
            fetchRecipes(query, category);
          }}
        />
        <DietaryFilter
          setCategory={(cat) => {
            setCategory(cat);
            fetchRecipes(searchQuery, cat);
          }}
        />
        <Routes>
          <Route path="/" element={<RecipeList recipes={recipes} />} />
          <Route path="/recipe/:id" element={<RecipeDetails />} />
        </Routes>
      </div>
    </Router>
  );
};

export default App;
