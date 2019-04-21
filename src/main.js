import './style1.css';
import imgIcon from './color.png';

var func = () => {
  var div = document.createElement('div');
  div.innerHTML = 'haddeeddeha';
  var img = new Image();
  img.src = imgIcon;
  div.appendChild(img);
  document.body.appendChild(div);

  console.log('hello world!');
}

func();
