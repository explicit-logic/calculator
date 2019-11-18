import './index.scss';
import settingsImg from './images/settings.svg';

export {};

function getName(name: string) {
  return name;
}

console.log(getName('B'));


function imgCreate(src: string, alt?: string, title?: string) {
  const img = document.createElement('img');
  img.src = src;
  if ( alt != null ) img.alt = alt;
  if ( title != null ) img.title = title;
  return img;
}

document.body.appendChild(imgCreate(settingsImg));
