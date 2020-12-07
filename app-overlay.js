
/**
  *
  * `app-overlay`
  *
  * 	Configurable full-screen overlay custom 
  * 	element that implements overlay-mixin.
  *
  *   
  *
  *
  *   Api:
  *
  *
  *     Methods:
  *     
  *     inherited from overlay-mixin:
  *
  *     back()
  *     close()
  *     open()
  *     reset()
  *
  *
  * @implements OverlayMixin
  *
  * @customElement
  * @polymer
  * @demo demo/index.html
  *   
  *
  */


import {AppElement, html} from '@longlost/app-core/app-element.js';
import {OverlayMixin}     from './overlay-mixin.js';
import htmlString         from './app-overlay.html';


class AppOverlay extends OverlayMixin(AppElement) {
  static get is() { return 'app-overlay'; }
  

  static get template() {
    return html([htmlString]);
  }
  
}

window.customElements.define(AppOverlay.is, AppOverlay);
