import { Card, CardHeader, CardTitle, CardContent } from "@/app/components/ui/card";
import Image from "next/image";

interface RecipeCardProps {
  recipe: any;
  onClick: () => void;
}

export default function RecipeCard({ recipe, onClick }: RecipeCardProps) {
  return (
    <Card 
      className="overflow-hidden shadow-md hover:shadow-lg transition-shadow cursor-pointer"
      onClick={onClick}
    >
      <div className="relative w-full h-40">
        <Image 
          src={recipe.image} 
          alt={recipe.title} 
          height={312} 
          width={231} 
          className="rounded-t-lg object-cover"
        />
      </div>
      <CardHeader>
        <CardTitle className="text-lg text-emerald-800 font-semibold">{recipe.title}</CardTitle>
      </CardHeader>
      <CardContent>
        <p className="text-sm text-gray-600">⏳ {recipe.readyInMinutes} min</p>
      </CardContent>
    </Card>
  );
}
