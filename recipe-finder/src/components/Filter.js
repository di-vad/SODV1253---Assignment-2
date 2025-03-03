import React, { useEffect, useState } from "react";

const DietaryFilter = ({ setCategory }) => {
  const [categories, setCategories] = useState([]);

  useEffect(() => {
    const fetchCategories = async () => {
      const response = await fetch(
        "https://www.themealdb.com/api/json/v1/1/categories.php"
      );
      const data = await response.json();
      setCategories(data.categories || []);
    };

    fetchCategories();
  }, []);

  return (
    <div>
      <label>Filter by Category:</label>
      <select onChange={(e) => setCategory(e.target.value)}>
        <option value="">All</option>
        {categories.map((cat) => (
          <option key={cat.idCategory} value={cat.strCategory}>
            {cat.strCategory}
          </option>
        ))}
      </select>
    </div>
  );
};

export default DietaryFilter;
