/* eslint-disable react/prop-types */
import * as React from "react";
import { Check, ChevronsUpDown } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/Components/ui/button";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
} from "@/Components/ui/command";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/Components/ui/popover";

export function Combobox({ list, item, setItem, ticket, setCountryName }) {
  const [open, setOpen] = React.useState(false);

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={open}
          className="w-full bg-slate-100 justify-between "
        >
          {item
            ? item === "any"
              ? "any"
              : ticket === "country"
              ? list.find((i) => i.iso_3166_1 === item).name
              : ticket === "genre"
              ? list.find((i) => i.name === item).name
              : ""
            : ticket === "country"
            ? "Select country..."
            : "Select genre..."}
          <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-[350px] p-0 bg-slate-100">
        <Command>
          <CommandInput
            placeholder={
              ticket === "country" ? "Search country..." : "Search genre..."
            }
          />
          <CommandEmpty>
            {ticket === "country" ? "No countries found" : "No genre found"}
          </CommandEmpty>
          <CommandGroup>
            <CommandItem
              key={Math.random()}
              onSelect={(currentValue) => {
                setItem(currentValue);
                setOpen(false);
              }}
            >
              <Check
                key={Math.random()}
                className={cn(
                  "mr-2 h-4 w-4",
                  item === "any" ? "opacity-100" : "opacity-0"
                )}
              />
              {"any"}
            </CommandItem>
            {list.map((item) => {
              return (
                <CommandItem
                  key={Math.random()}
                  onSelect={(currentValue) => {
                    if (ticket === "country") {
                      setCountryName(item.name);
                      setItem(item.iso_3166_1);
                    } else {
                      console.log(item);
                      setItem(item.name);
                    }
                    setOpen(false);
                  }}
                >
                  <Check
                    className={cn(
                      "mr-2 h-4 w-4",
                      item === item.name ? "opacity-100" : "opacity-0"
                    )}
                  />
                  {item.name} ({item.stationcount})
                </CommandItem>
              );
            })}
          </CommandGroup>
        </Command>
      </PopoverContent>
    </Popover>
  );
}
