"use client";

import { useState, useRef, useEffect, useCallback } from "react";
import { useFilters } from "@/app/context/FilterContext";
import { fetchRecipes } from "@/app/utils/fetchRecipes";
import { fetchRecipeDetails } from "@/app/utils/fetchRecipeDetails";
import { fetchIngredients } from "@/app/utils/fetchIngredients";
import RecipeCard from "@/app/components/layout/RecipeCard";
import RecipeModal from "@/app/components/layout/RecipeModal";
import { Button } from "@/app/components/ui/button";
import MultiSelect from "@/app/components/ui/multi_select";
import { Menu } from "lucide-react";
import { Sheet, SheetTrigger, SheetContent } from "@/app/components/ui/sheet";
import { RadioGroup, RadioGroupItem } from "@/app/components/ui/radio-group";
import { Checkbox } from "@/app/components/ui/checkbox";
import ScrollToTopButton from "./components/ui/scroll_top_button";


const diets = ["Vegan", "Vegetarian", "Low-carb", "Ketogenic", "Paleo"];
const mealTypes = ["Breakfast", "Lunch", "Dinner", "Snack", "Pre-workout", "Post-workout"];
const intolerances = ["Gluten-free", "Lactose-free", "Nut-free"];


export default function HomePage() {
  const { selectedDietas, setSelectedDietas, 
          selectedIngredientes, setSelectedIngredientes, 
          tempoPreparo, setTempoPreparo, 
          dificuldade, setDificuldade, 
          selectedRefeicoes, setSelectedRefeicoes, 
          selectedIntolerancias, setSelectedIntolerancias } = useFilters();
  const [ingredients, setIngredients] = useState<string[]>([]);
  const [recipes, setRecipes] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [page, setPage] = useState(0);
  const [hasMore, setHasMore] = useState(true);
  const observer = useRef<IntersectionObserver | null>(null);
  const [query, setQuery] = useState("a");
  const [selectedRecipe, setSelectedRecipe] = useState<any | null>(null);
  const [loadingDetails, setLoadingDetails] = useState(false);
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false);

  const fetchRecipeData = async (reset = false) => {
    setLoading(true);
    const newRecipes = await fetchRecipes({ 
      diet: selectedDietas.length > 0 ? selectedDietas.join(",") : undefined,
      intolerances: selectedIntolerancias.length > 0 ? selectedIntolerancias.join(",") : undefined,
      ingredients: selectedIngredientes,
      time: tempoPreparo || undefined,
      mealType: selectedRefeicoes.length > 0 ? selectedRefeicoes[0] : undefined,
      difficulty: dificuldade || undefined,
      page: reset ? 0 : page
    });

    setRecipes((prevRecipes) => {
      const mergedRecipes = reset ? newRecipes : [...prevRecipes, ...newRecipes];
  
      const uniqueRecipes = Array.from(
        new Map(mergedRecipes.map((r: { id: number }) => [r.id, r])).values()
      );
    
      return uniqueRecipes;
    });
    setHasMore(newRecipes.length > 0);
    setLoading(false);
  };

  const handleSearch = () => {
    setPage(0);
    setRecipes([]);
    fetchRecipeData(true);
  };

  const handleRecipeClick = async (recipe: any) => {
    setLoadingDetails(true);
    try {
      const detailedRecipe = await fetchRecipeDetails(recipe.id);
      setSelectedRecipe(detailedRecipe);
    } catch (error) {
      console.error("Error fetching recipe details:", error);
    } finally {
      setLoadingDetails(false);
    }
  };

  const lastRecipeRef = useCallback(
    (node: HTMLDivElement | null) => {
      if (loading) return;
      if (observer.current) observer.current.disconnect();
      observer.current = new IntersectionObserver((entries) => {
        if (entries[0].isIntersecting && hasMore) {
          setPage((prevPage) => prevPage + 1);
          fetchRecipeData();
        }
      });
      if (node) observer.current.observe(node);
    },
    [loading, hasMore]
  );

 useEffect(() => {
    async function getIngredients() {
      if (!query) {
        setIngredients([]);
        return;
      }

      setLoading(true);;
      const fetchedIngredients = await fetchIngredients(query);
      setIngredients(fetchedIngredients.length > 0 ? fetchedIngredients : []);
      setLoading(false);
    }

    const delayDebounce = setTimeout(() => {
      getIngredients();
    }, 500);

    return () => clearTimeout(delayDebounce);
  }, [query]);

  
  const clearFilters = () => {
    setSelectedDietas([]);
    setSelectedIngredientes([]);
    setSelectedRefeicoes([]);
    setSelectedIntolerancias([]);
    setTempoPreparo("");
    setDificuldade("");
    fetchRecipeData(true);
  };

  useEffect(() => {
    fetchRecipeData();
  }, [page]);

  return (
    <div className="flex">
      
      <aside className="hidden lg:block w-64 p-4 bg-emerald-50 border border-emerald-200 rounded-lg fixed top-16 left-0 h-[calc(100vh-4rem)] overflow-y-auto shadow-md space-y-5">
        <h2 className="text-lg font-subtitle text-emerald-900">Filters</h2>
  	    
        
        <div>
          <h3 className="font-bold text-emerald-800 mb-2">Diets</h3>
          <MultiSelect options={diets} value={selectedDietas} onChange={setSelectedDietas} placeholder="Select diets" />
        </div>

      
      <div>
        <h3 className="font-bold text-emerald-800 mb-2">Ingredients</h3>
        <MultiSelect
          options={ingredients} 
          value={selectedIngredientes}
          onChange={setSelectedIngredientes}
          placeholder="Type an ingredient..."
          onSearchChange={setQuery}
          loading={loading}
        />
      </div>

      
      <div>
        <h3 className="font-bold text-emerald-800 mb-2">Cooking Time</h3>
        <RadioGroup value={tempoPreparo} onValueChange={setTempoPreparo}>
    {[
      { label: "Up to 15 min", value: "15" },
      { label: "Up to 30 min", value: "30" },
      { label: "Up to 60 min", value: "60" }
    ].map((time) => (
      <div key={time.value} className="flex items-center space-x-2">
        <RadioGroupItem value={time.value} id={time.value} />
        <label htmlFor={time.value} className="text-sm text-emerald-800">{time.label}</label>
      </div>
    ))}
  </RadioGroup>
      </div>

      
      <div>
        <h3 className="font-bold text-emerald-800 mb-2">Meal Type</h3>
        <div className="space-y-2">
          {mealTypes.map((type) => (
            <div key={type} className="flex items-center space-x-2">
              <Checkbox id={type} checked={selectedRefeicoes.includes(type)} onCheckedChange={(checked) => setSelectedRefeicoes(prev => checked ? [...prev, type] : prev.filter(r => r !== type))} />
              <label htmlFor={type} className="text-sm text-emerald-800">{type}</label>
            </div>
          ))}
        </div>
      </div>

      
      <div>
        <h3 className="font-bold text-emerald-800 mb-2">Difficulty Level</h3>
        <RadioGroup value={dificuldade} onValueChange={setDificuldade}>
          {["Easy", "Medium", "Hard"].map((level) => (
            <div key={level} className="flex items-center space-x-2">
              <RadioGroupItem value={level} id={level} />
              <label htmlFor={level} className="text-sm text-emerald-800">{level}</label>
            </div>
          ))}
        </RadioGroup>
      </div>

      
      <div>
        <h3 className="font-bold text-emerald-800 mb-2">Intolerances</h3>
        <div className="space-y-2">
          {intolerances.map((intolerance) => (
            <div key={intolerance} className="flex items-center space-x-2">
              <Checkbox id={intolerance} checked={selectedIntolerancias.includes(intolerance)} onCheckedChange={(checked) => setSelectedIntolerancias(prev => checked ? [...prev, intolerance] : prev.filter(i => i !== intolerance))} />
              <label htmlFor={intolerance} className="text-sm text-emerald-800">{intolerance}</label>
            </div>
          ))}
        </div>
      </div>

        
        <div className="flex justify-between mt-4">
          <Button variant="outline" size="sm" onClick={clearFilters}>
            Clear Filters
          </Button>
          <Button variant="default" size="sm" onClick={handleSearch}>
            Search
          </Button>
        </div>
      </aside>

      
      <div className="fixed bottom-4 left-4 lg:hidden z-50">
        <Sheet open={isMobileSidebarOpen} onOpenChange={setIsMobileSidebarOpen}>
          <SheetTrigger asChild>
            <Button variant="outline" size="icon" className="fixed top-[5rem] left-1 z-50 bg-emerald-500 hover:bg-emerald-600 text-white shadow-lg lg:hidden">
              <Menu className="w-6 h-6" />
            </Button>
          </SheetTrigger>
          <SheetContent side="left" className="w-72 h-screen p-4 overflow-y-auto flex flex-col">
            <h2 className="text-lg font-subtitle text-emerald-900">Filters</h2>

            <div>
              <h3 className="font-bold text-emerald-800 mb-2">Diets</h3>
              <MultiSelect options={diets} value={selectedDietas} onChange={setSelectedDietas} placeholder="Select diets" />
            </div>

            
            <div>
              <h3 className="font-bold text-emerald-800 mb-2">Ingredients</h3>
              <MultiSelect
                options={ingredients} 
                value={selectedIngredientes}
                onChange={setSelectedIngredientes}
                placeholder="Type an ingredient..."
                onSearchChange={setQuery} 
                loading={loading} 
              />
            </div>

            
            <div>
              <h3 className="font-bold text-emerald-800 mb-2">Cooking Time</h3>
              <RadioGroup value={tempoPreparo} onValueChange={setTempoPreparo}>
                {[
                  { label: "Up to 15 min", value: "15" },
                  { label: "Up to 30 min", value: "30" },
                  { label: "Up to 60 min", value: "60" }
                ].map((time) => (
                  <div key={time.value} className="flex items-center space-x-2">
                    <RadioGroupItem value={time.value} id={time.value} />
                    <label htmlFor={time.value} className="text-sm text-emerald-800">{time.label}</label>
                  </div>
                ))}
              </RadioGroup>
            </div>

            
            <div>
              <h3 className="font-bold text-emerald-800 mb-2">Meal Type</h3>
              <div className="space-y-2">
                {mealTypes.map((type) => (
                  <div key={type} className="flex items-center space-x-2">
                    <Checkbox id={type} checked={selectedRefeicoes.includes(type)} onCheckedChange={(checked) => setSelectedRefeicoes(prev => checked ? [...prev, type] : prev.filter(r => r !== type))} />
                    <label htmlFor={type} className="text-sm text-emerald-800">{type}</label>
                  </div>
                ))}
              </div>
            </div>

            
            <div>
              <h3 className="font-bold text-emerald-800 mb-2">Difficulty Level</h3>
              <RadioGroup value={dificuldade} onValueChange={setDificuldade}>
                {["Easy", "Medium", "Hard"].map((level) => (
                  <div key={level} className="flex items-center space-x-2">
                    <RadioGroupItem value={level} id={level} />
                    <label htmlFor={level} className="text-sm text-emerald-800">{level}</label>
                  </div>
                ))}
              </RadioGroup>
            </div>

            
            <div>
              <h3 className="font-bold text-emerald-800 mb-2">Intolerances</h3>
              <div className="space-y-2">
                {intolerances.map((intolerance) => (
                  <div key={intolerance} className="flex items-center space-x-2">
                    <Checkbox id={intolerance} checked={selectedIntolerancias.includes(intolerance)} onCheckedChange={(checked) => setSelectedIntolerancias(prev => checked ? [...prev, intolerance] : prev.filter(i => i !== intolerance))} />
                    <label htmlFor={intolerance} className="text-sm text-emerald-800">{intolerance}</label>
                  </div>
                ))}
              </div>
            </div>

            
            <div className="flex justify-between mt-4">
              <Button variant="outline" size="sm" onClick={clearFilters}> Clear Filters</Button>
              <Button variant="default" size="sm" onClick={() => {
                handleSearch();
                setIsMobileSidebarOpen(false); 
              }} >Search</Button>
            </div>
          </SheetContent>
        </Sheet>
      </div>

      
      <div className="flex-1 p-4">
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 lg:pl-64">
          {recipes.map((recipe, index) => (
            <div ref={index === recipes.length - 1 ? lastRecipeRef : null} key={recipe.id ?? `recipe-${index}`}>
              <RecipeCard recipe={recipe} onClick={() => handleRecipeClick(recipe)} />
            </div>
          ))}
        </div>
        {loading && <p className="text-center text-gray-500 mt-4">Loading recipes...</p>}
      </div>
       
      <RecipeModal 
        recipe={selectedRecipe} 
        open={!!selectedRecipe} 
        onClose={() => setSelectedRecipe(null)} 
        loading={loadingDetails}
        />
      <ScrollToTopButton />
    </div>
  );
}
