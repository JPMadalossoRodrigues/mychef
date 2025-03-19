export async function fetchRecipeDetails(recipeId: number) {
    const API_KEY = process.env.NEXT_PUBLIC_SPOONACULAR_API_KEY;
    const API_URL = `https://api.spoonacular.com/recipes/${recipeId}/information`;
  
    try {
      const response = await fetch(`${API_URL}?apiKey=${API_KEY}`);
      if (!response.ok) {
        throw new Error("Failed to fetch recipe details.");
      }
  
      const data = await response.json();
      return data;
    } catch (error) {
      console.error("Error fetching recipe details:", error);
      return null;
    }
  }
  