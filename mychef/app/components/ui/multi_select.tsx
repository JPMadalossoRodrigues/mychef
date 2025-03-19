"use client";

import * as React from "react";
import { Command, CommandInput, CommandList, CommandEmpty, CommandGroup, CommandItem } from "@/app/components/ui/command";
import { Popover, PopoverTrigger, PopoverContent } from "@/app/components/ui/popover";
import { Button } from "@/app/components/ui/button";
import { Badge } from "@/app/components/ui/badge";
import { Check, ChevronsUpDown, X } from "lucide-react";

interface MultiSelectProps {
  options: string[];
  value: string[];
  onChange: (selected: string[]) => void;
  placeholder?: string;
  onSearchChange?: (query: string) => void;
  loading?: boolean;
}

export default function MultiSelect({ 
  options, 
  value, 
  onChange, 
  placeholder = "Select...",
  onSearchChange, 
  loading = false 
}: MultiSelectProps) {
  
  const [open, setOpen] = React.useState(false);
  const [filteredOptions, setFilteredOptions] = React.useState<string[]>(options);
  const [updateTrigger, setUpdateTrigger] = React.useState(0);

  
React.useEffect(() => {
  if (JSON.stringify(filteredOptions) !== JSON.stringify(options)) {
    setFilteredOptions([...options]); 
    setUpdateTrigger((prev) => prev+1); 
  }
}, [options]);
  

  const toggleOption = (option: string) => {
    onChange(value.includes(option) ? value.filter((v) => v !== option) : [...value, option]);
  };

  const removeOption = (option: string) => {
    onChange(value.filter((v) => v !== option));
  };

  return (
    <div>
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button variant="outline" className="w-full justify-between">
          {value.length > 0 ? value.join(", ") : placeholder}
          <ChevronsUpDown className="ml-2 h-4 w-4 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-full p-0">
        <Command  key={updateTrigger}>
          <CommandInput placeholder="Search ingredients..." onValueChange={onSearchChange} />
          <CommandList>
            {loading ? (
              <p className="text-gray-500 text-center p-2">Loading...</p>
            ) : (
              <>
                <CommandEmpty>No ingredients found.</CommandEmpty>
                <CommandGroup >
                  {filteredOptions.map((option) => (
                    <CommandItem key={option} onSelect={() => toggleOption(option)}>
                      <Check className={`mr-2 h-4 w-4 ${value.includes(option) ? "opacity-100" : "opacity-0"}`} />
                      {option}
                    </CommandItem>
                  ))}
                </CommandGroup>
              </>
            )}
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
    {value.length > 0 && (
        <div className="mt-2 flex flex-wrap gap-2">
          {value.map((option) => (
            <Badge key={option} variant="secondary" className="flex items-center space-x-2 px-2 py-1 text-sm">
              {option}
              <button onClick={() => removeOption(option)} className="ml-1 text-gray-600 hover:text-red-600">
                <X className="w-3 h-3" />
              </button>
            </Badge>
          ))}
        </div>
      )}
    </div>
  );
}
