'use strict';

// Интерфейс контроллера
import ControllerInterface from './BaseController.js';
import { ConstantMessages, Html } from '../utils/constants.js';

/**
 * Класс, реализующий контроллер используемый в целях разработки
 */
export default class TestController extends ControllerInterface {
  constructor() {
    super();
    this.parent = document.getElementById(Html.Root);
  }

  work() {
    const message = document.createElement('h1');
    message.innerText = 'Test Controller';
    message.style.color = '#8000FF';
    this.parent.innerHTML = '<br/> <a href="/"> На главную </a>';
    this.parent.appendChild(message);
  }
}
