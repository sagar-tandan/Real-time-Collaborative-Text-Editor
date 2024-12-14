import React, { useState } from "react";
import { Input } from "../ui/input";
import { Button } from "../ui/button";
import { SearchIcon, XIcon } from "lucide-react";

const SearchItem = () => {
  const [value, setValue] = useState("");

  const handleChange = (e) => {
    e.preventDefault();
    setValue(e.target.value);
  };

  const handleClear = (e) => {
    e.preventDefault();
    setValue("");
  };

  const handleSubmit = () => {
    console.log(value);
  };
  
  return (
    <div className="w-full flex items-center justify-center">
      <form
        onSubmit={handleSubmit}
        className="max-w-[720px] relative w-full"
        action=""
      >
        <input
          value={value}
          onChange={handleChange}
          placeholder="Search"
          className="md:text-base placeholder:text-neutral-800 px-14 w-full border-0 outline-none shadow-sm focus-visible:shadow-neutral-400 bg-[#f0f4f8] rounded-full h-[48px] ring-0 focus:bg-white"
        />
        <Button
          type="submit"
          size="icon"
          variant="ghost"
          className="absolute left-3 top-1/2 -translate-y-1/2 rounded-full"
        >
          <SearchIcon />
        </Button>

        {value && (
          <Button
            onClick={handleClear}
            type="submit"
            size="icon"
            variant="ghost"
            className="absolute right-3 top-1/2 -translate-y-1/2 rounded-full"
          >
            <XIcon />
          </Button>
        )}
      </form>
    </div>
  );
};

export default SearchItem;
