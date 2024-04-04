import React from "react";

const Button = ({type, label}) => {
  return (
    <button
      type= {type}
      className="text-white bg-black hover:bg-gray-800 focus:bg-gray-800 focus:ring-4 focus:outline-none  font-medium rounded-lg text-sm px-5 py-2.5 text-center me-2 mb-2"
    >
      {label}
    </button>
  );
};

export default Button;
