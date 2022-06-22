import React from 'react';
import logo from '../images/logo.svg';

function Header(props) {
  return (
    <header className={`header ${props.isNavActive ? 'header_active' : ''}`}>
      <div className={`${props.isNavActive ? 'header__logo-box' : ''}`}>
        <img id="header-logo" src={logo} alt="logo" className="header__logo" />
        <button className={`header__close-btn ${props.isNavActive ? 'header__close-btn_visible hover-btn' : ''}`}
          onClick={props.onClose}></button>
      </div>
      {props.children}
    </header>
  )
}

export default Header; 
