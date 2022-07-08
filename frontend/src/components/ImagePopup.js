import React from 'react';
import Popup from './Popup';

function ImagePopup(props) {

  return (
    <Popup isOpen={props.isOpen} onClose={props.onClose} cardPopupClass={true}>
      <img src={props.card.link} alt={props.card.name} className="popup__card-img" />
      <h2 className="popup__card-title">{props.card.name}</h2>
    </Popup>
  )

}

export default ImagePopup; 