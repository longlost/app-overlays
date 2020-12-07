
/**
	*
  * `overlay-mixin`
  *
  *
  * 	Common logic between all app overlay elements.
  *
  *
  *
  * 	@customElement
  * 	@polymer
  * 	@demo demo/index.html
  *
  *
  **/


import {enableScrolling, schedule} from '@longlost/app-core/utils.js';
import {customAnimation} 	 				 from '@longlost/app-core/animation.js';


export const OverlayMixin = superClass => {
  return class OverlayMixin extends superClass {

  	
	  static get properties() {
	    return {

	    	// While in modal mode, the overlay can measure its height 
	    	// relative to the bottom of the screen (default),
	    	// or it can mearsure its height realtive to the visible 
	    	// portion of the screen that is above iOS Safari's 
	    	// bottom nav bar.
	    	// 'modal' property MUST be set for this to take effect.
	    	aboveSafariNav: Boolean,

	      // Object with custom entry and exit animation collections.
	      customAnimation: Object,

	      // Set by dev to determine scroll action.
	      // 'true' defeats document scrolling while overlay is open.
	      modal: Boolean,

	      // Optional common and simple prebuilt entry animations.
	      prebuiltAnimation: String,

	      // Used for overlay scroll controller mixin in app-shell.
	      // overlay-control-mixin.js
	      symbol: Object,

	      // Common entry and exit animations object.
	      _prebuiltAnimationObj: Object

	    };
	  }
	  

	  connectedCallback() {
	  	super.connectedCallback();

	  	if (!this.customAnimation) { 
	  		this._prebuiltAnimationObj = this.__getPrebuitAnimation(this.prebuiltAnimation);
	  	}

	    this.symbol = Symbol(); // <app-shell> overlay-control-mixin.js
	  }

	  // Simple, included entry and exit animations.
	  __getPrebuitAnimation(str) {

	  	const customEase = 'cubic-bezier(0.49, 0.01, 0, 1)';
	    
	    const animations = {

	    	'from-bottom': {
	        open: [{
	          name:    'slide-from-bottom', 
	          nodes:   this, 
	          options: {duration: 650, easing: customEase}
	        }, {
	          name:    'fade-in', 
	          nodes:   this, 
	          options: {delay: 50, duration: 600, easing: 'ease-out'}
	        }],
	        back: [{
	          name:    'slide-left', 
	          nodes:   this, 
	          options: {duration: 500, easing: customEase}
	        }, {
	          name:    'fade-out', 
	          nodes:   this, 
	          options: {duration: 450, easing: 'ease-in'}
	        }],
	        close: [{
	          name:    'slide-down', 
	          nodes:   this, 
	          options: {duration: 550, easing: customEase}
	        }, {
	          name:    'fade-out', 
	          nodes:   this, 
	          options: {duration: 500, easing: 'ease-in'}
	        }]
	      },

	      'from-top': {
	        open: [{
	          name:    'slide-from-top', 
	          nodes:   this, 
	          options: {duration: 600, easing: customEase}
	        }, {
	          name:    'fade-in', 
	          nodes:   this, 
	          options: {delay: 50, duration: 550, easing: 'ease-out'}
	        }],
	        back: [{
	          name:    'slide-left', 
	          nodes:   this, 
	          options: {duration: 500, easing: customEase}
	        }, {
	          name:    'fade-out', 
	          nodes:   this, 
	          options: {duration: 450, easing: 'ease-in'}
	        }],
	        close: [{
	          name:    'slide-up', 
	          nodes:   this, 
	          options: {duration: 550, easing: customEase}
	        }, {
	          name:    'fade-out', 
	          nodes:   this, 
	          options: {duration: 500, easing: 'ease-in'}
	        }]
	      },

	      'from-left': {
	        open: [{
	          name:    'slide-from-left', 
	          nodes:   this, 
	          options: {duration: 550, easing: customEase}
	        }, {
	          name:    'fade-in', 
	          nodes:   this, 
	          options: {delay: 50, duration: 500, easing: 'ease-out'}
	        }],
	        back: [{
	          name:    'slide-left', 
	          nodes:   this, 
	          options: {duration: 500, easing: customEase}
	        }, {
	          name:    'fade-out', 
	          nodes:   this, 
	          options: {duration: 450, easing: 'ease-in'}
	        }],
	        close: [{
	          name:    'slide-right', 
	          nodes:   this, 
	          options: {duration: 500, easing: customEase}
	        }, {
	          name:    'fade-out', 
	          nodes:   this, 
	          options: {duration: 450, easing: 'ease-in'}
	        }]
	      },

	      'from-right': {
	        open: [{
	          name:    'slide-from-right', 
	          nodes:   this, 
	          options: {duration: 550, easing: customEase}
	        }, {
	          name:    'fade-in', 
	          nodes:   this, 
	          options: {delay: 50, duration: 500, easing: 'ease-out'}
	        }],
	        back: [{
	          name:    'slide-left', 
	          nodes:   this, 
	          options: {duration: 500, easing: customEase}
	        }, {
	          name:    'fade-out', 
	          nodes:   this, 
	          options: {duration: 450, easing: 'ease-in'}
	        }],
	        close: [{
	          name:    'slide-right', 
	          nodes:   this, 
	          options: {duration: 500, easing: customEase}
	        }, {
	          name:    'fade-out', 
	          nodes:   this, 
	          options: {duration: 450, easing: 'ease-in'}
	        }]
	      },

	      'scale': {
	        open: [{
	          name:    'scale-up', 
	          nodes:   this, 
	          options: {duration: 375, easing: customEase}
	        }, {
	          name:    'fade-in', 
	          nodes:   this, 
	          options: {delay: 50, duration: 325, easing: 'ease-out'}
	        }],
	        back: [{
	          name:    'slide-left', 
	          nodes:   this, 
	          options: {duration: 295, easing: customEase}
	        }, {
	          name:    'fade-out', 
	          nodes:   this, 
	          options: {duration: 270, easing: 'ease-in'}
	        }],
	        close: [{
	          name:    'scale-down', 
	          nodes:   this, 
	          options: {duration: 345, easing: customEase}
	        }, {
	          name:    'fade-out', 
	          nodes:   this, 
	          options: {duration: 325, easing: 'ease-in'}
	        }]
	      }

	    };

	    return animations[str];
	  }


	  __runAnimation(type) {
	  	
  		if (this.customAnimation) {
        return customAnimation(this.customAnimation[type]);
      } 
      else if (this.prebuiltAnimation) {
        return customAnimation(this._prebuiltAnimationObj[type]);
      }
	  }

	  // Can be overwritten for implementation specific logic.
	  __exitImplementation() {
	  	return;
	  }


	  async __playExitAnimation(type) {
  		try {
	      this.fire('overlay-preparing-to-exit', {node: this, type});

	      await schedule();

  			this.fire('overlay-exiting', {node: this, type});
      	this.__exitImplementation();

      	await schedule();
      	await this.__runAnimation(type);

        this.reset(type);
  		}
  		catch (error) { console.warn('overlay exit error: ', error); }
	  }

	  // Can be overwritten for implementation specific logic.
	  __preOpenImplementation() { 

	  	if (this.modal) {

	  		// These styles applied to fill the screen.	  		
	  		this.style['position'] = 'fixed';
	  		this.style['padding']  = '0px';

	  		// Use 'bottom' instead of 'min-height'
	  		// here in order to measure mobile Safari's
	  		// bottom nav bar.
	  		if (this.aboveSafariNav) {
		  		this.style['bottom'] 		 = '0px';
		  		this.style['height'] 		 = 'unset';
		  		this.style['min-height'] = 'unset';
	  		}

	  		enableScrolling(false);
	  	}

	  	return Promise.resolve();
	  }

	  // Can be overwritten for implementation specific logic.
	  __postOpenImplementation() {
	  	return Promise.resolve();
	  }

	  
	  async open() {
      try {
      	const detail = {node: this};

      	this.fire('overlay-preparing-to-open', detail);

        this.style['display'] = 'block';

        await schedule();

        this.fire('overlay-opening', detail);

        await this.__preOpenImplementation();
        await schedule();
		  	await this.__runAnimation('open');

      	this.style['transform'] = 'none';
        this.style['opacity'] 	= '1';

		  	await  this.__postOpenImplementation();

        this.fire('overlay-opened', detail);
      }
      catch (error) { console.warn('overlay open error: ', error); }
	  }

	  // Returns a promise.
	  back() {
	    return this.__playExitAnimation('back');
	  }
	  
	  // Returns a promise.
	  close() {
	    return this.__playExitAnimation('close');
	  }

	  // Can be overwritten for implementation specific logic.
	  __resetImplementation() {

    	if (this.modal) {

	  		// Enable scrolling.
	  		enableScrolling(true);
	  	}
  	}


  	reset(type = 'reset') {
	    this.style['display']   = 'none';
	    this.style['opacity']   = '0';
	    this.style['transform'] = 'none';

	    this.__resetImplementation();
	    this.fire('overlay-reset', {node: this, type});
	  }
	  
	};
};
