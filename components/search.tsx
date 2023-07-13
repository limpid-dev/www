import React, { ChangeEvent, useState } from "react";
import { MagnifyingGlass, SquaresFour } from "@phosphor-icons/react";
import { Button } from "../components/primitives/button";
import { Input } from "../components/primitives/input";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "../components/primitives/sheet";
import { Options } from "../components/primitives/options";
import clsx from "clsx";

interface SearchOptionsProps {
  selectedCheckboxes: number[];
  handleCheckboxChange: (event: ChangeEvent<HTMLInputElement>) => void;
  handleSearch: () => void;
  handleReset: () => void;
}

export const SearchOptions: React.FC<SearchOptionsProps> = ({
  handleCheckboxChange,
  handleSearch,
  handleReset,
}) => {
  const [selectedCheckboxes, setSelectedCheckboxes] = useState<number[]>([]);

  const [searchQuery, setSearchQuery] = useState("");

  const handleSearchChange = (event: ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(event.target.value);
  };

  return (
    <div className="flex justify-center items-center flex-wrap gap-3">
      <div className="flex rounded-md border">
        <Input
          value={searchQuery}
          onChange={handleSearchChange}
          type="search"
          placeholder="Искать по профилям"
          className="rounded-lg border-none"
        />
        <Button
          onClick={handleSearch}
          className=" bg-transparent ring-0 ring-transparent hover:bg-slate-100 active:bg-slate-200"
        >
          <MagnifyingGlass className="w-5 h-5 text-black" />
        </Button>
      </div>
      <div className="flex gap-4">
        <Sheet>
          <SheetTrigger asChild>
            <Button variant="outline">
              <SquaresFour className="w-6 h-6" />
            </Button>
          </SheetTrigger>
          <SheetContent position="right" size="default">
            <SheetHeader>
              <SheetTitle>Сфера деятельности</SheetTitle>
              <SheetDescription>
                Выберите сферы деятельности интересующие вас
              </SheetDescription>
            </SheetHeader>

            <div className="flex rounded-md border my-3">
              <Input
                type="search"
                className="rounded-lg border-none"
                value={searchQuery}
                onChange={handleSearchChange}
                placeholder="Поиск..."
              />
              <Button
                disabled
                className=" bg-transparent ring-0 ring-transparent hover:bg-slate-100 active:bg-slate-200"
              >
                <MagnifyingGlass className="w-5 h-5 text-black" />
              </Button>
            </div>

            <div className="grid grid-cols-2 gap-4 py-4 overflow-auto max-h-[67%] sm:max-h-[79%]">
              {Options.filter((option) =>
                option.name.toLowerCase().includes(searchQuery.toLowerCase())
              ).map((option) => (
                <div
                  key={option.id}
                  className="flex items-center gap-3 bg-slate-50 rounded-md p-3 h-min"
                >
                  <input
                    type="checkbox"
                    value={option.id}
                    checked={selectedCheckboxes.includes(option.id)}
                    onChange={handleCheckboxChange}
                    className="rounded-md"
                  />
                  <p className="text-sm">{option.name}</p>
                </div>
              ))}
            </div>

            <SheetFooter className={clsx("flex justify-between gap-3 pt-3")}>
              <Button
                type="reset"
                variant="outline"
                onClick={handleReset}
                className="w-full"
              >
                Сбросить
              </Button>
              <Button
                type="submit"
                className={clsx(
                  "bg-slate-900 text-white hover:bg-slate-800 w-full"
                )}
                variant="subtle"
              >
                Применить
              </Button>
            </SheetFooter>
          </SheetContent>
        </Sheet>
      </div>
    </div>
  );
};
