import React from 'react';
import { useEffect } from "react";

const Popup = ({ isOpen, name, onClose, cardPopupClass, children }) => {
  useEffect(() => {
    if (!isOpen) return;
    const closeByEscape = (e) => {
      if (e.key === 'Escape') {
        onClose();
      }
    }

    document.addEventListener('keydown', closeByEscape)
    return () => document.removeEventListener('keydown', closeByEscape)
  }, [isOpen, onClose])

  const handleOverlay = (e) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  }

  return (
    <div
      className={`popup ${isOpen ? "popup_opened" : ""} popup_${name}`}
      onClick={handleOverlay}
    >
      <div className={(cardPopupClass) ? 'popup__card-container' : 'popup__container'}>
        {children}
        <button
          className='popup__close-btn hover-btn'
          type='button'
          onClick={onClose}
        />
      </div>
    </div>
  );
};

export default Popup;