import React from 'react';
import Popup from './Popup';

function PopupWithForm(props) {

  return (
    <Popup isOpen={props.isOpen} name={props.name} onClose={props.onClose}>
      <h2 className="popup__title">{props.title}</h2>
      <form
        className="popup__form"
        name={`register-${props.name}`}
        onSubmit={props.onSubmit}>
        {props.children}
        <button className={`popup__save-btn ${!props.isValid ? 'popup__save-btn_disabled' : ''}`} type="submit">{props.buttonText}</button>
      </form>
    </Popup>
  )
}

export default PopupWithForm; 
