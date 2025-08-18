import React, { useState, useEffect, useRef } from "react";
import { ChevronDown, Search } from "lucide-react";

/**
 * A customizable and searchable dropdown component.
 *
 * @param {Object} props
 * @param {Array<string>} props.items - An array of strings to be displayed in the dropdown.
 * @param {string} props.placeholder - The placeholder text for the dropdown button.
 * @param {Function} props.onSelect - The callback function to be executed when an item is selected. It receives the selected item as an argument.
 * @param {string} props.value - The currently selected value to display.
 */
const SearchableDropdown = ({ items, placeholder, onSelect, value }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const dropdownRef = useRef(null);

  // Close the dropdown when clicking outside of it.
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  // Filter items based on the search term.
  const filteredItems = items.filter((item) =>
    item.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleItemClick = (item) => {
    setSearchTerm(""); // Clear search term after selection
    setIsOpen(false);
    if (onSelect) {
      onSelect(item);
    }
  };

  const handleToggle = () => {
    setIsOpen(!isOpen);
    // When opening, reset the search term to an empty string.
    if (!isOpen) {
      setSearchTerm("");
    }
  };

  return (
    <div className="relative w-64" ref={dropdownRef}>
      {/* Dropdown toggle button */}
      <button
        type="button"
        className="flex justify-between items-center w-full px-4 py-2 text-sm font-medium text-white bg-gray-800 border border-gray-300/50 rounded-md shadow-sm hover:bg-gray-900 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-all duration-200"
        onClick={handleToggle}
      >
        <span>{value || placeholder}</span>
        <ChevronDown
          className={`w-5 h-5 ml-2 transition-transform duration-200 ${
            isOpen ? "rotate-180" : ""
          }`}
        />
      </button>

      {/* Dropdown panel */}
      {isOpen && (
        <div className="absolute z-10 w-full mt-2 bg-gray-800 rounded-md shadow-lg border border-gray-200/50 ring-1 ring-black ring-opacity-5 focus:outline-none transition-all duration-200 transform scale-100 opacity-100 origin-top ">
          {/* Search input field */}
          <div className="p-2 border-b border-gray-200">
            <div className="relative">
              <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                <Search className="h-5 w-5 text-gray-200" />
              </div>
              <input
                type="text"
                placeholder="Search..."
                className="w-full pl-10 pr-4 py-2 text-sm text-gray-100 placeholder-gray-200 bg-gray-800 border border-gray-300/50 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                autoFocus
              />
            </div>
          </div>

          {/* List of filtered items */}
          <ul className="max-h-32 overflow-y-auto custom-scrollbar">
            {filteredItems.length > 0 ? (
              filteredItems.map((item, index) => (
                <li
                  key={index}
                  className="px-4 py-2 cursor-pointer hover:bg-gray-900 transition-colors duration-150"
                  onClick={() => handleItemClick(item)}
                >
                  {item}
                </li>
              ))
            ) : (
              <li className="px-4 py-2 text-gray-500 text-sm italic">
                No results found.
              </li>
            )}
          </ul>
        </div>
      )}
    </div>
  );
};

export default SearchableDropdown;
