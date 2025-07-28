import { faCaretDown } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useEffect, useRef, useState } from "react";

export default function CustomDropdownFilter({ filterType, setFilterType, options }) {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null);

  useEffect(() => {
    function handleClickOutside(event) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleSelect = (value) => {
    setFilterType(value);
    setIsOpen(false);
  };

  const selectedLabel = options.find((opt) => opt.value === filterType)?.label || "Select";

  return (
    <div ref={dropdownRef} style={{ position: "relative", width: 220 }}>
      <button
        type="button"
        aria-haspopup="listbox"
        aria-expanded={isOpen}
        onClick={() => setIsOpen((prev) => !prev)}
        style={{
          width: "100%",
          padding: "8px 12px",
          borderRadius: 4,
          border: "1.5px solid #00C321", 
          background: "#e6f4ea", 
          cursor: "pointer",
          textAlign: "left",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          fontSize: "1rem",
          color: "#006400", 
          fontWeight: "600",
          boxShadow: isOpen ? "0 0 8px #00C321aa" : "none",
          transition: "box-shadow 0.3s ease",
        }}
      >
        {selectedLabel}
        <span style={{ marginLeft: 8 }}>
          <FontAwesomeIcon color="#00c321" icon={faCaretDown} />
        </span>
      </button>

      {isOpen && (
        <ul
          role="listbox"
          tabIndex={-1}
          className="no-scrollbar"
          style={{
            position: "absolute",
            top: "100%",
            left: 0,
            right: 0,
            background: "#f0faf5",
            border: "1.5px solid #00C321",
            borderRadius: 4,
            marginTop: 4,
            maxHeight: 180,
            overflowY: "auto",
            padding: 0,
            listStyleType: "none",
            zIndex: 1000,
            boxShadow: "0 4px 6px rgba(0, 195, 33, 0.15)"
          }}
        >
          {options.map((option) => {
            const isSelected = option.value === filterType;
            return (
              <li
                key={option.value}
                role="option"
                aria-selected={isSelected}
                tabIndex={0}
                onClick={() => handleSelect(option.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter" || e.key === " ") {
                    handleSelect(option.value);
                  }
                }}
                style={{
                  padding: "10px 14px",
                  backgroundColor: isSelected ? "#00C321" : "transparent",
                  color: isSelected ? "white" : "#004d00",
                  cursor: "pointer",
                  fontWeight: isSelected ? "700" : "500",
                }}
                onMouseEnter={(e) => {
                  if (!isSelected) e.currentTarget.style.backgroundColor = "#cce5ff";
                }}
                onMouseLeave={(e) => {
                  if (!isSelected) e.currentTarget.style.backgroundColor = "transparent";
                }}
              >
                {option.label}
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
}