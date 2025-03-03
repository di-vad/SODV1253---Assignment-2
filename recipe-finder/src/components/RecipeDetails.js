import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";

const RecipeDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [details, setDetails] = useState(null);

  useEffect(() => {
    const fetchDetails = async () => {
      const response = await fetch(
        `https://www.themealdb.com/api/json/v1/1/lookup.php?i=${id}`
      );
      const data = await response.json();
      setDetails(data.meals ? data.meals[0] : null);
    };

    fetchDetails();
  }, [id]);

  if (!details) return <p>Loading...</p>;

  return (
    <div>
      <button onClick={() => navigate("/")}>Back</button>
      <h2>{details.strMeal}</h2>
      <img src={details.strMealThumb} alt={details.strMeal} width="200" />
      <p>
        <strong>Category:</strong> {details.strCategory}
      </p>
      <p>
        <strong>Cuisine:</strong> {details.strArea}
      </p>
      <h3>Ingredients:</h3>
      <ul>
        {[...Array(20)].map((_, i) => {
          const ingredient = details[`strIngredient${i + 1}`];
          const measure = details[`strMeasure${i + 1}`];
          return ingredient ? (
            <li key={i}>
              {measure} {ingredient}
            </li>
          ) : null;
        })}
      </ul>
      <h3>Instructions:</h3>
      <p>{details.strInstructions}</p>
    </div>
  );
};

export default RecipeDetails;
