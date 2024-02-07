import React from "react";
import { ListGroup } from "react-bootstrap";

const AutocompleteOptions = ({ options, handleSelection }) => {
  const handleItemClick = (option) => {
    handleSelection(option);
  };

  return (
    <ListGroup>
      {options.map((option, index) => (
        <ListGroup.Item 
          key={index} 
          onClick={() => handleItemClick(option)}
          style={{ cursor: "pointer" }} 
        >
          {option.name}
        </ListGroup.Item>
      ))}
    </ListGroup>
  );
};

export default AutocompleteOptions;
