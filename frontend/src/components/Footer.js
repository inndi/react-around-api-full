import React from 'react';

function Footer() {
  const initYear = new Date().getFullYear();

  return (
    <footer className="footer">
      <p className="footer__copyright">&copy; {initYear} Around The U.S.</p>
    </footer>
  )
}

export default Footer; 