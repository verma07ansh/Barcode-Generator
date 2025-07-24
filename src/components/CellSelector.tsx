import React, { useState, useRef, useEffect } from 'react';
import { ChevronDown, ChevronUp, Search, X, CheckSquare, Square } from 'lucide-react';

interface CellSelectorProps {
  selectedCells: number[];
  onCellSelect: (cells: number[]) => void;
  totalCells: number;
  occupiedCells?: number[];
}

const CellSelector: React.FC<CellSelectorProps> = ({
  selectedCells,
  onCellSelect,
  totalCells,
  occupiedCells = []
}) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsExpanded(false);
      }
    };

    if (isExpanded) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isExpanded]);

  const filteredCells = Array.from({ length: totalCells }, (_, i) => i + 1)
    .filter(cell => cell.toString().includes(searchTerm));

  const handleCellClick = (cell: number) => {
    if (occupiedCells.includes(cell)) return; // Prevent selecting occupied cells
    
    if (selectedCells.includes(cell)) {
      // Remove cell if already selected
      onCellSelect(selectedCells.filter(c => c !== cell));
    } else {
      // Add cell to selection
      onCellSelect([...selectedCells, cell].sort((a, b) => a - b));
    }
  };

  const handleSelectAll = () => {
    const availableCells = filteredCells.filter(cell => !occupiedCells.includes(cell));
    const selectedAvailable = selectedCells.filter(cell => availableCells.includes(cell));
    
    if (selectedAvailable.length === availableCells.length) {
      // Deselect all available filtered cells
      onCellSelect(selectedCells.filter(cell => !availableCells.includes(cell)));
    } else {
      // Select all available filtered cells
      const newSelection = [...new Set([...selectedCells, ...availableCells])].sort((a, b) => a - b);
      onCellSelect(newSelection);
    }
  };

  const clearSelection = () => {
    onCellSelect([]);
  };

  const displayText = selectedCells.length === 0 
    ? 'No cells selected' 
    : selectedCells.length === 1 
      ? `Cell ${selectedCells[0]}` 
      : `${selectedCells.length} cells selected`;

  const availableFilteredCells = filteredCells.filter(cell => !occupiedCells.includes(cell));
  const selectedAvailableFiltered = selectedCells.filter(cell => availableFilteredCells.includes(cell));
  const allAvailableSelected = availableFilteredCells.length > 0 && 
    selectedAvailableFiltered.length === availableFilteredCells.length;

  return (
    <div className="relative" ref={dropdownRef}>
      {/* Selected cells display */}
      <button
        onClick={() => setIsExpanded(!isExpanded)}
        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 flex items-center justify-between bg-white hover:bg-gray-50 transition-all duration-200 text-sm"
      >
        <span className="text-gray-700 truncate">{displayText}</span>
        <div className="flex items-center space-x-2 flex-shrink-0">
          <span className="text-xs text-gray-500 bg-gray-100 px-2 py-0.5 rounded">
            {selectedCells.length}/{totalCells}
          </span>
          {isExpanded ? (
            <ChevronUp className="h-4 w-4 text-gray-500" />
          ) : (
            <ChevronDown className="h-4 w-4 text-gray-500" />
          )}
        </div>
      </button>

      {/* Selected cells preview */}
      {selectedCells.length > 1 && !isExpanded && (
        <div className="mt-2 flex flex-wrap gap-1">
          {selectedCells.slice(0, 8).map((cell) => (
            <span
              key={cell}
              className="inline-flex items-center px-2 py-0.5 text-xs bg-blue-100 text-blue-700 rounded"
            >
              {cell}
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  handleCellClick(cell);
                }}
                className="ml-1 hover:bg-blue-200 rounded-full p-0.5"
              >
                <X className="h-2.5 w-2.5" />
              </button>
            </span>
          ))}
          {selectedCells.length > 8 && (
            <span className="inline-flex items-center px-2 py-0.5 text-xs bg-gray-100 text-gray-600 rounded">
              +{selectedCells.length - 8} more
            </span>
          )}
        </div>
      )}

      {/* Dropdown */}
      {isExpanded && (
        <div className="absolute top-full left-0 right-0 mt-1 bg-white border border-gray-300 rounded-lg shadow-lg z-50 max-h-80 flex flex-col">
          {/* Search and controls */}
          <div className="p-3 border-b border-gray-100 bg-gray-50 space-y-2 flex-shrink-0">
            <div className="relative">
              <input
                type="text"
                placeholder="Search cell number..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full px-3 py-1.5 pl-8 text-sm border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
              />
              <Search className="absolute left-2.5 top-2 h-3.5 w-3.5 text-gray-400" />
            </div>
            
            <div className="flex items-center justify-between">
              <button
                onClick={handleSelectAll}
                className="flex items-center space-x-1 text-xs text-blue-600 hover:text-blue-700 font-medium"
              >
                {allAvailableSelected ? (
                  <CheckSquare className="h-3.5 w-3.5" />
                ) : (
                  <Square className="h-3.5 w-3.5" />
                )}
                <span>{allAvailableSelected ? 'Deselect All' : 'Select All'}</span>
              </button>
              
              {selectedCells.length > 0 && (
                <button
                  onClick={clearSelection}
                  className="flex items-center space-x-1 text-xs text-red-600 hover:text-red-700 font-medium"
                >
                  <X className="h-3.5 w-3.5" />
                  <span>Clear</span>
                </button>
              )}
            </div>
          </div>

          {/* Cell grid - Scrollable content */}
          <div className="flex-1 overflow-y-auto p-3">
            {filteredCells.length > 0 ? (
              <div className="grid grid-cols-5 gap-1.5">
                {filteredCells.map((cell) => {
                  const isSelected = selectedCells.includes(cell);
                  const isOccupied = occupiedCells.includes(cell);
                  
                  return (
                    <button
                      key={cell}
                      onClick={() => handleCellClick(cell)}
                      disabled={isOccupied}
                      className={`p-2 text-xs rounded text-center transition-all duration-200 font-medium relative min-h-[32px] ${
                        isOccupied
                          ? 'bg-red-100 text-red-400 cursor-not-allowed border border-red-200'
                          : isSelected
                          ? 'bg-blue-600 text-white shadow-md'
                          : 'bg-gray-100 text-gray-700 hover:bg-blue-100 hover:text-blue-700'
                      }`}
                    >
                      {cell}
                      {isSelected && !isOccupied && (
                        <div className="absolute -top-0.5 -right-0.5 w-3 h-3 bg-green-500 rounded-full flex items-center justify-center">
                          <CheckSquare className="h-2 w-2 text-white" />
                        </div>
                      )}
                      {isOccupied && (
                        <div className="absolute -top-0.5 -right-0.5 w-3 h-3 bg-red-500 rounded-full flex items-center justify-center">
                          <X className="h-2 w-2 text-white" />
                        </div>
                      )}
                    </button>
                  );
                })}
              </div>
            ) : (
              <div className="text-center py-4 text-gray-500">
                <Search className="h-6 w-6 mx-auto mb-2 text-gray-300" />
                <p className="text-sm">No cells found</p>
              </div>
            )}
          </div>

          {/* Footer with cell count */}
          <div className="p-2 border-t border-gray-100 bg-gray-50 text-center flex-shrink-0">
            <span className="text-xs text-gray-600">
              Showing {filteredCells.length} of {totalCells} cells
              {occupiedCells.length > 0 && (
                <span className="text-red-600 ml-2">
                  ({occupiedCells.length} occupied)
                </span>
              )}
            </span>
          </div>
        </div>
      )}
    </div>
  );
};

export default CellSelector;