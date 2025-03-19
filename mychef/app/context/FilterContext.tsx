'use client';

import { createContext, useContext, useState } from "react";

interface FilterContextProps {
    selectedDietas: string[];
    setSelectedDietas: React.Dispatch<React.SetStateAction<string[]>>;
    selectedIngredientes: string[];
    setSelectedIngredientes: React.Dispatch<React.SetStateAction<string[]>>;
    tempoPreparo: string;
    setTempoPreparo: React.Dispatch<React.SetStateAction<string>>;
    dificuldade: string;
    setDificuldade: React.Dispatch<React.SetStateAction<string>>;
    selectedRefeicoes: string[];
    setSelectedRefeicoes: React.Dispatch<React.SetStateAction<string[]>>;
    selectedIntolerancias: string[];
    setSelectedIntolerancias: React.Dispatch<React.SetStateAction<string[]>>;
  }

const FilterContext = createContext<FilterContextProps | undefined>(undefined);

export function FilterProvider({ children }: { children: React.ReactNode }) {
  const [selectedDietas, setSelectedDietas] = useState<string[]>([]);
  const [selectedIngredientes, setSelectedIngredientes] = useState<string[]>([]);
  const [tempoPreparo, setTempoPreparo] = useState<string>("");
  const [dificuldade, setDificuldade] = useState<string>("");
  const [selectedRefeicoes, setSelectedRefeicoes] = useState<string[]>([]);
  const [selectedIntolerancias, setSelectedIntolerancias] = useState<string[]>([]);

  return (
    <FilterContext.Provider
      value={{
        selectedDietas,
        setSelectedDietas,
        selectedIngredientes,
        setSelectedIngredientes,
        tempoPreparo,
        setTempoPreparo,
        dificuldade,
        setDificuldade,
        selectedRefeicoes,
        setSelectedRefeicoes,
        selectedIntolerancias,
        setSelectedIntolerancias,
      }}
    >
      {children}
    </FilterContext.Provider>
  );
}

export function useFilters() {
  const context = useContext(FilterContext);
  if (!context) {
    throw new Error("useFilters deve ser usado dentro de um FilterProvider");
  }
  return context;
}