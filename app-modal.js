
/**
  * `app-modal`
  *
  *   Configurable full-screen modal element.
  *
  * @customElement
  * @polymer
  * @demo demo/index.html
  *
  *
  **/


import {AppElement, html}       from '@longlost/app-core/app-element.js';
import {consumeEvent, schedule} from '@longlost/app-core/utils.js';
import htmlString               from './app-modal.html';
import '@longlost/app-core/app-shared-styles.js';
import '@polymer/paper-card/paper-card.js';
import './app-overlay.js';


class AppModal extends AppElement {
  static get is() { return 'app-modal'; }

  static get template() {
    return html([htmlString]);
  }


  static get properties() {
    return {

      prebuiltAnimation: {
        type: String,
        value: 'scale'
      },

      heading: String,

      _hideCardActions: {
        type: Boolean,
        value: true
      },

      _hideCardContent: {
        type: Boolean,
        value: true
      }

    };
  }
  

  connectedCallback() {
    super.connectedCallback();

    // Prevent event from passing up to app-main, 
    // causing the underlay to be translated down.
    this.addEventListener('overlay-exiting', consumeEvent);

    // Do not allow events to be mixed with 
    // parent's own overlay through bubbling.
    this.addEventListener('overlay-reset', consumeEvent);
  }


  disconnectedCallback() {
    super.disconnectedCallback();

    this.removeEventListener('overlay-exiting', consumeEvent);
    this.removeEventListener('overlay-reset',   consumeEvent);
  }


  __actionsSlotChange() {    
    this._hideCardActions = !this.slotHasNodes('#actionsSlot');
  }


  __contentSlotChange() {
    this._hideCardContent = !this.slotHasNodes('#contentSlot');
  }

  // Ignore card clicks.
  __cardClicked(event) {
    consumeEvent(event);
  }


  async back() {
    this.style.opacity = '0';
    await this.$.overlay.back();
    this.style.display = 'none';
  }


  async close() {
    this.style.opacity = '0';
    await this.$.overlay.close();
    this.style.display = 'none';
  }


  async open() {
    this.style.display = 'block';
    await schedule();
    this.style.opacity = '1';
    return this.$.overlay.open();
  }


  reset() {
    this.style.opacity = '0';
    this.style.display = 'none';
    this.$.overlay.reset();
  }

}

window.customElements.define(AppModal.is, AppModal);
