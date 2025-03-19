"use client";

import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/app/components/ui/dialog";
import Image from "next/image";
import { ScrollArea } from "@/app/components/ui/scroll-area";
import { Button } from "@/app/components/ui/button";
import { Loader2 } from "lucide-react";

interface RecipeModalProps {
  recipe: any;
  open: boolean;
  onClose: () => void;
  loading: boolean;
}

export default function RecipeModal({ recipe, open, onClose, loading }: RecipeModalProps) {
  if (!recipe && !loading) return null;

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl bg-white rounded-lg shadow-xl p-6">
        {loading ? (
          <div className="flex flex-col items-center justify-center">
            <Loader2 className="w-6 h-6 animate-spin" />
            <p className="mt-2 text-gray-600">Loading recipe details...</p>
          </div>
        ) : (
          <>
            <DialogHeader>
              <DialogTitle className="text-xl text-emerald-800 font-bold">{recipe.title}</DialogTitle>
              <DialogDescription className="text-sm text-gray-600">
                ⏳ {recipe.readyInMinutes} min | 🍽️ Servings: {recipe.servings}
              </DialogDescription>
            </DialogHeader>

            
            <div className="relative w-full h-64">
              <Image src={recipe.image} alt={recipe.title} layout="fill" objectFit="cover" className="rounded-md" />
            </div>

            
            <ScrollArea className="h-60 mt-4 pr-2">
              <h3 className="font-bold text-lg text-emerald-800">Ingredients</h3>
              <ul className="list-disc pl-5 space-y-1 text-sm text-gray-700">
                {recipe.extendedIngredients?.map((ingredient: any) => (
                  <li key={ingredient.id}>{ingredient.original}</li>
                ))}
              </ul>

              <h3 className="font-bold text-lg text-emerald-800 mt-4">Instructions</h3>
              <ol className="list-decimal pl-5 space-y-2 text-sm text-gray-700">
                {recipe.analyzedInstructions?.length > 0 ? (
                  recipe.analyzedInstructions[0].steps.map((step: any) => (
                    <li key={step.number}>{step.step}</li>
                  ))
                ) : (
                  <p>No instructions available.</p>
                )}
              </ol>
            </ScrollArea>

            
            <div className="mt-4 flex justify-end">
              <Button variant="outline" onClick={onClose}>Close</Button>
            </div>
          </>
        )}
      </DialogContent>
    </Dialog>
  );
}
