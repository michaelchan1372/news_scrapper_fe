import React, { useEffect, useState } from 'react';
import { Check, X, ChevronDown } from 'lucide-react';

// Type definitions
export interface Option {
  value: string;
  label: string;
}

interface MultiSelectDropdownProps {
  options?: Option[];
  placeholder?: string;
  onSelectionChange?: (selectedOptions: Option[]) => void;
  className?: string;
  disabled?: boolean;
  maxHeight?: string;
}

const MultiSelectDropdown: React.FC<MultiSelectDropdownProps> = ({
  options = [
  ],
  placeholder = 'Select...',
  onSelectionChange,
  className = '',
  disabled = false,
  maxHeight = 'max-h-60'
}) => {
  
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const [selectedOptions, setSelectedOptions] = useState<Option[]>([]);

  useEffect(()=> {
    setSelectedOptions(options)
  }, [options])

  const handleOptionToggle = (option: Option): void => {
    setSelectedOptions(prev => {
      let newSelection: Option[];
      
      if (prev.some(item => item.value === option.value)) {
        // Remove if already selected
        newSelection = prev.filter(item => item.value !== option.value);
      } else {
        // Add if not selected
        newSelection = [...prev, option];
      }
     
      // Call callback if provided
      onSelectionChange?.(newSelection);
      return newSelection;
    });
  };

  const removeOption = (optionToRemove: Option): void => {
    const newSelection = selectedOptions.filter(item => item.value !== optionToRemove.value);
    setSelectedOptions(newSelection);
    onSelectionChange?.(newSelection);
  };

  const clearAll = (): void => {
    setSelectedOptions([]);
    onSelectionChange?.([]);
  };

  const toggleSelectAll = (): void => {
    if (selectedOptions.length === options.length) {
      clearAll();
    } else {
      setSelectedOptions([...options]);
      onSelectionChange?.([...options]);
    }
  };

  const isSelected = (option: Option): boolean => {
    return selectedOptions.some(item => item.value === option.value);
  };

  const handleButtonClick = (): void => {
    if (!disabled) {
      setIsOpen(!isOpen);
    }
  };

  const handleTagRemove = (e: React.MouseEvent<HTMLButtonElement>, option: Option): void => {
    e.stopPropagation();
    removeOption(option);
  };

  const handleClearClick = (e: React.MouseEvent<HTMLButtonElement>): void => {
    e.stopPropagation();
    clearAll();
  };

  return (
    
      <div className="pr-2 max-w-128">
        <div className="relative">
          {/* Main select button */}
          <div
            onClick={handleButtonClick}
            className={`w-full bg-white border border-gray-300 rounded-lg px-4 py-3 text-left shadow-sm transition-colors min-h-[48px] ${
              disabled 
                ? 'bg-gray-100 cursor-not-allowed' 
                : 'hover:border-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500'
            }`}
          >
            <div className="flex items-center justify-between">
              <div className="flex-1">
                {selectedOptions.length === 0 ? (
                  <span className={disabled ? 'text-gray-400' : 'text-gray-500'}>
                    {placeholder}
                  </span>
                ) : (
                  <div className="flex flex-wrap gap-1">
                    {selectedOptions.map((option: Option) => (
                      <span
                        key={option.value}
                        className="inline-flex items-center gap-1 px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded-md"
                      >
                        <Check className="w-3 h-3" />
                        {option.label}
                        {!disabled && (
                          <button
                            onClick={(e) => handleTagRemove(e, option)}
                            className="hover:bg-blue-200 rounded p-0.5 transition-colors"
                            type="button"
                          >
                            <X className="w-3 h-3" />
                          </button>
                        )}
                      </span>
                    ))}
                  </div>
                )}
              </div>
              
              {/* Clear all button */}
              {selectedOptions.length > 0 && !disabled && (
                <button
                  onClick={handleClearClick}
                  className="mr-2 px-2 py-1 text-xs text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded transition-colors"
                  type="button"
                >
                  Clear
                </button>
              )}
              
              {/* Chevron icon */}
              <ChevronDown 
                className={`w-5 h-5 text-gray-400 transition-transform duration-200 ${
                  isOpen ? 'rotate-180' : ''
                } ${disabled ? 'opacity-50' : ''}`} 
              />
            </div>
          </div>

          {/* Dropdown menu */}
          {isOpen && !disabled && (
            <div className={`absolute z-10 w-full mt-1 bg-white border border-gray-300 rounded-lg shadow-lg ${maxHeight} overflow-auto`}>
              {/* Select/Deselect all */}
              <div className="px-4 py-2 border-b border-gray-100">
                <button
                  onClick={toggleSelectAll}
                  className="text-sm text-blue-600 hover:text-blue-800 font-medium"
                  type="button"
                >
                  {selectedOptions.length === options.length ? 'Deselect All' : 'Select All'}
                </button>
              </div>

              {options.map((option: Option) => {
                const selected = isSelected(option);
                return (
                  <button
                    key={option.value}
                    onClick={() => handleOptionToggle(option)}
                    className="w-full px-4 py-3 text-left hover:bg-gray-50 focus:bg-gray-50 focus:outline-none flex items-center transition-colors"
                    type="button"
                  >
                    {/* Tick icon for selected option */}
                    <div className="w-5 h-5 mr-3 flex items-center justify-center">
                      {selected && (
                        <Check className="w-5 h-5 text-green-500" />
                      )}
                    </div>
                    
                    <span className={`${
                      selected 
                        ? 'text-gray-900 font-medium' 
                        : 'text-gray-700'
                    }`}>
                      {option.label}
                    </span>

                    {/* Optional: Show selected count indicator */}
                    {selected && (
                      <div className="ml-auto w-2 h-2 bg-green-500 rounded-full"></div>
                    )}
                  </button>
                );
              })}
            </div>
          )}
        </div>
      </div>

  );
};

export default MultiSelectDropdown;