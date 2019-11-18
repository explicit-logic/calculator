import * as React from "react";
import * as ReactDOM from "react-dom";

import {Calculator} from './calculator/Calculator';

import './index.scss';
import settingsImg from './images/settings.svg';


function imgCreate(src: string, alt?: string, title?: string) {
  const img = document.createElement('img');
  img.src = src;
  if ( alt != null ) img.alt = alt;
  if ( title != null ) img.title = title;
  return img;
}

// document.body.appendChild(imgCreate(settingsImg));

ReactDOM.render(
  <Calculator compiler="TypeScript" framework="React" />,
  document.getElementById("main")
);
