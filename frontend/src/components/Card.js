import React, { useContext, useState } from "react";
import { CurrentUserContext } from "../contexts/CurrentUserContext";

function Card(props) {

  const currentUser = useContext(CurrentUserContext);

  const isOwn = currentUser._id === props.card.owner;
  const cardDeleteButtonClassName = (
    `card__delete-btn hover-btn ${isOwn && 'card__delete-btn_active'}`
  );

  const isLiked = props.card.likes.some((user) => user === currentUser._id);
  const cardLikeButtonClassName = (
    `card__like-btn ${isLiked && 'card__like-btn_active'}`
  );

  function handleLikeClick() {
    props.onCardLike(props.card);
  }

  function handleDeleteClick() {
    props.onDeleteClick(props.card);
  }

  function handleClick() {
    props.onCardClick(props.card);
  }

  return (
    <li className="card">
      <div
        className="card__img"
        style={{ backgroundImage: `url(${props.card.link})` }}
        onClick={handleClick}></div>
      <h2 className="card__title">{props.card.name}</h2>
      <button
        className={cardLikeButtonClassName}
        type="button"
        onClick={handleLikeClick}></button>
      <p className="card__likes-amount">{props.card.likes.length}</p>
      <button
        className={cardDeleteButtonClassName}
        type="button"
        onClick={handleDeleteClick}> </button>
    </li>
  )

}

export default Card; 