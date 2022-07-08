import React, { useEffect } from "react";
import PopupWithForm from "./PopupWithForm";
import { useFormAndValidation } from "../hooks/useFormAndValidation";

export function AddPlacePopup(props) {
  const { values, handleChange, errors, isValid, resetForm } = useFormAndValidation();

  function handleSubmit(e) {
    e.preventDefault();

    props.onAddPlaceSubmit({
      name: values.placeTitle,
      link: values.placeLink
    })
  }

  useEffect(() => {
    resetForm();
  }, [props.isOpen]);

  return (
    <PopupWithForm
      name="add"
      title="New place"
      isOpen={props.isOpen}
      isValid={isValid}
      onClose={props.onClose}
      onSubmit={handleSubmit}
      buttonText={props.buttonText}>
      <input
        onChange={handleChange}
        value={values.placeTitle || ''}
        id="title-input"
        type="text"
        name="placeTitle"
        placeholder="Title"
        autoComplete="off"
        className="popup__input popup__input_field_title"
        minLength="1"
        maxLength="30"
        required />
      <div className="popup__error-container">
        <span className="popup__input-error title-input-error">{errors.placeTitle}</span>
      </div>
      <input
        onChange={handleChange}
        value={values.placeLink || ''}
        id="link-input"
        type="url"
        name="placeLink"
        placeholder="Image link"
        autoComplete="off"
        className="popup__input popup__input_field_link"
        required />
      <div className="popup__error-container">
        <span className="popup__input-error link-input-error">{errors.placeLink}</span>
      </div>
    </PopupWithForm>
  )
}