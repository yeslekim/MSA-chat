// Modal.js
import React from 'react';
import './Modal.css';

const Modal = ({ isOpen, onClose, onSubmit }) => {
  const [inputValue, setInputValue] = React.useState('');

  const handleSubmit = () => {
    onSubmit(inputValue);
    setInputValue('');
  };

  if (!isOpen) return null;

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <h3>Enter User ID</h3>
        <input
          type="text"
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          placeholder="Enter your ID"
        />
        <div>
          <button onClick={handleSubmit}>Submit</button>
          <button onClick={onClose}>Close</button>
        </div>
      </div>
    </div>
  );
};

export default Modal;
