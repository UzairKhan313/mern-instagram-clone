import { useState } from "react";
import { ClickAwayListener } from "@mui/material";
import { searchIcon } from "../SvgIcons";

const SearchBar = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const handleClickAway = () => {};
  const handleFocus = () => {};
  return (
    <ClickAwayListener onClickAway={handleClickAway}>
      <div className="hidden sm:flex items-center gap-3 pl-4 ml-36 w-64 py-2 bg-[#efefef] rounded-lg relative">
        {searchIcon}
        <input
          className="bg-transparent text-sm border-none outline-none flex-1 pr-3"
          type="search"
          value={searchTerm}
          onFocus={handleFocus}
          onChange={(e) => setSearchTerm(e.target.value)}
          placeholder="Search"
        />
      </div>
    </ClickAwayListener>
  );
};

export default SearchBar;
