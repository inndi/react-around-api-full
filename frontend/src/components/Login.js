import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import Header from './Header';
import './styles/Auth.css';
import { useFormAndValidation } from "../hooks/useFormAndValidation";

function Login(props) {

  const { values, handleChange, errors } = useFormAndValidation();

  function handleOnLogin(e) {
    e.preventDefault();
    props.handleAuthSubmit(values.email, values.password);
  }

  return (
    <div className="page">
      <Header>
        <Link to="signup" className="header__link hover-btn">Sign up</Link>
      </Header>
      <div className="auth">
        <h2 className="auth__title">Log in</h2>
        <form className="auth__form" onSubmit={handleOnLogin}>
          <input
            id="email-input"
            type="email"
            name="email"
            placeholder="Email"
            onChange={handleChange}
            value={values.email || ""}
            autoComplete="off"
            className="auth__input auth__input_field_email"
            required />
          <div className="auth__error-container">
            <span className="auth__input-error email-input-error">{errors.email}</span>
          </div>
          <input
            id="password-input"
            type="password"
            name="password"
            placeholder="Password"
            onChange={handleChange}
            value={values.password || ""}
            autoComplete="off"
            className="auth__input auth__input_field_password"
            minLength="8"
            required />
          <div className="auth__error-container">
            <span className="auth__input-error password-input-error">{errors.password}</span>
          </div>
          <button className="auth__btn hover-btn" type="submit">Log in</button>
        </form>
        <div className="auth__str-container">
          <p className="auth__str">Not a member yet?</p>
          <Link to="signup" className="auth__link hover-btn"> Sign up here!</Link>
        </div>
      </div>
    </div>
  )
}

export default Login; 
