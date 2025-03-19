export async function fetchRecipes(filters: {
    diet?: string;
    intolerances?: string;
    ingredients?: string[];
    time?: string;
    mealType?: string;
    difficulty?: string;
    page?: number;
  }) {
    const API_KEY = process.env.NEXT_PUBLIC_SPOONACULAR_API_KEY;
    const API_URL = "https://api.spoonacular.com/recipes/complexSearch";

    const offset = (filters.page || 0) * 10;


    const params = new URLSearchParams({
      apiKey: API_KEY || "",
      number: "10", 
      offset: offset.toString(),
      addRecipeInformation: "true", 
      ...(filters.diet ? { diet: filters.diet } : {}),
      ...(filters.intolerances ? { intolerances: filters.intolerances } : {}),
      ...(filters.time ? { maxReadyTime: filters.time } : {}),
      ...(filters.mealType ? { type: filters.mealType } : {}), 
      ...(filters.difficulty ? { difficulty: filters.difficulty } : {}), 
    });
  
    if (filters.ingredients && filters.ingredients.length > 0) {
      params.append("includeIngredients", filters.ingredients.join(","));
    }
  
    try {
      const response = await fetch(`${API_URL}?${params.toString()}`);
      if (!response.ok) {
        throw new Error("Failed to fetch recipes.");
      }
  
      const data = await response.json();
      return data.results;
    } catch (error) {
      console.error("Error fetching recipes:", error);
      return [];
    }
  }
  