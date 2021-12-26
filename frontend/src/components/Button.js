import React from "react";

const Button = ({ color, text, onclick }) => {
  return (
    <button
      onClick={onclick}
      className="create-button"
      style={{
        backgroundColor: color,
      }}
    >
      {text}
    </button>
  );
};

export default Button;
