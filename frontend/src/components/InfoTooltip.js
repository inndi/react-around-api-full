import React from 'react';
import Popup from './Popup';

function InfoTooltip(props) {

  return (
    <Popup isOpen={props.isOpen} onClose={props.onClose}>
      <img className="popup__img" src={props.imgSrc}></img>
      <h2 className="popup__title popup__title-tooltip">{props.title}</h2>
    </Popup>
  )

}

export default InfoTooltip;