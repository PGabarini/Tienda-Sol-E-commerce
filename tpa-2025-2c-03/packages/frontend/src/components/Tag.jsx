import React, { useState } from "react";

export function TagInput({ values, setValues, placeholder }) {
  const [inputValue, setInputValue] = useState("");

  const addTag = () => {
    const trimmed = inputValue.trim();
    if (trimmed && !values.includes(trimmed)) {
      setValues([...values, trimmed]);
    }
    setInputValue("");
  };

  const removeTag = (index) => {
    setValues(values.filter((_, i) => i !== index));
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter" || e.key === ",") {
      e.preventDefault();
      addTag();
    }
    if (e.key === "Backspace" && !inputValue && values.length) {
      removeTag(values.length - 1);
    }
  };

  return (
    <div className="tag-input-container" onClick={() => document.getElementById(placeholder).focus()}>
      {values.map((tag, i) => (
        <span className="tag" key={i}>
          {tag}
          <button type="button" onClick={() => removeTag(i)}>×</button>
        </span>
      ))}
      <input
        id={placeholder}
        value={inputValue}
        placeholder={placeholder}
        onChange={(e) => setInputValue(e.target.value)}
        onKeyDown={handleKeyDown}
      />
    </div>
  );
}
