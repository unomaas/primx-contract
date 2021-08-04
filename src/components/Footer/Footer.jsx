import React from 'react';
import './Footer.css';
import { Box } from '@material-ui/core';

// This is one of our simplest components
// It doesn't have local state, so it can be a function component.
// It doesn't dispatch any redux actions or display any part of redux state
// or even care what the redux state is, so it doesn't need 'connect()'

function Footer() {
  return (
    <footer className="lexendFont footerPrint">
      <img src="./images/PrimXLogo-Spaced-01.svg" height="60"></img>
      <br/>
      &copy; 2021 PrīmX NA. All rights reserved.
    </footer>
  )
}

export default Footer;
