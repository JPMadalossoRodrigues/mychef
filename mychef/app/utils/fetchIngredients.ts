export async function fetchIngredients(query: string) {
  if (!query) return []; // Se não houver texto, retorna vazio

  const API_KEY = process.env.NEXT_PUBLIC_SPOONACULAR_API_KEY;
  const API_URL = `https://api.spoonacular.com/food/ingredients/autocomplete?query=${query}&number=10&apiKey=${API_KEY}`;

  try {
    const response = await fetch(API_URL);
    if (!response.ok) {
      throw new Error("Erro ao buscar ingredientes da Spoonacular.");
    }

    const data = await response.json();
    return data.map((item: { name: string }) => item.name);
  } catch (error) {
    console.error("Erro ao buscar ingredientes:", error);
    return [];
  }
}
