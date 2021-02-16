
/**
  *
  * `app-header-overlay`
  *
  *
  *   
  *   Styling:
  *
  *
  *     --background-color:                  var(--app-background-color);    
  *     --bottom-toolbar-text-width:         100%;
  *     --header-backdrop-filter:            none;
  *     --header-background-color:           var(--app-primary-dark-color);
  *     --header-background-parallax-height: 140%;
  *     --header-color:                      var(--app-primary-dark-color-text, white);
  *     --header-pointer-events:             auto;
  *     --header-shadow:                     inset 0px 5px 6px -3px rgb(0 0 0 / 40%);
  *     --header-vignette-background:        radial-gradient(rgba(0, 0, 0, 0), rgb(0, 0, 0));
  *     --header-vignette-opacity:           0.3;
  *
  *
  *
  *   Slots:
  *
  *   
  *     header-background-slot      element that will be placed in the header background and
  *                                 get parallax and fade-on-scroll effects, typically an image
  *
  *     top-toolbar-buttons-slot    upper-right icon buttons go here
  *   
  *     middle-toolbar-${i}-slot    middle toolbar slots that are created dynamically based
  *                                 off header height, one for every toolbar over the top and bottom
  *
  *     bottom-toolbar-buttons-slot lower-right icon buttons go here
  *
  *     bottom-toolbar-tabs-slot    tabs go here
  * 
  *     fab-slot                    fab that is placed near the right side, half way over the bottom
  *                                 toolbar and content
  *
  *     content                     all non-header elements go here
  *
  *
  *
  *
  *   Api:
  *
  *
  *     Properties:
  *
  *
  *       bottomToolbarText <String> '',        lower-left toolbar text
  *
  *       closeButton <Boolean>                 undefined, includes a close button in upper-right toolbar when true
  *
  *       disableAutoSticky <Boolean>           when true, skip setting bottom toolbar to sticky automatically based
  *                                             off bottom toolbar contents or lack thereof
  *
  *       disableCondense <Boolean> false,      removes condenses attribute on header
  *
  *       disableParallax <Boolean> undefined,  turn off header-background-slot container's parallax effect
  *
  *       disableWarnings <Boolean> undefined,  quelsh warnings about having too many items in the bottom toolbar
  *
  *       fixedHeader <Boolean>  undefined,     fixes the top toolbar by default, use in conjunction with
  *                                             stickyBottomToolbar to create different effects
  *
  *       headerSize <Number> 1,                multiple of toolbars to give the header
  *
  *       parentControlsExits <Boolean>,        when true, header will not close itself with back/close buttons 
  *
  *       resetScroll <Boolean> undefined,      set scroll to 0 and place header back to initial state each time the
  *                                             overlay is opened
  *
  *       revealHeader <Boolean> undefined,     header comes into view when scrolling back to top
  *
  *       stickyBottomToolbar <Boolean>,        pin bottom toolbar instead of top toolbar during scroll
  *
  *       threshold <Number> 0,                 used to control when a 'threshold-triggered-changed' event is fired
  *                                             based on header scroll position
  *
  *       title <String> 'Title',               header main-title that will resize from bottom toolbar to top on scroll
  *                                             if topTitle is false and/or no bottomToolbarText is present
  *
  *       topTitle <Boolean> undefined,         override standard title condense effect (from bottom toolbar to top)
  *                                             and pin title to top toolbar
  *
  *
  *
  *     Methods:
  *
  *     
  *       Inherited from overlay-mixin.
  *
  *       back()
  *       close()
  *       open()
  *       reset()
  *
  *
  * @customElement
  * @polymer
  * @demo demo/index.html
  *
  **/


import {AppElement, html}        from '@longlost/app-core/app-element.js';
import {OverlayMixin}            from './overlay-mixin.js';
import {getRootTarget, schedule} from '@longlost/app-core/utils.js';
import htmlString                from './app-header-overlay.html';
import '@longlost/app-core/app-icons.js';
import '@polymer/app-layout/app-header-layout/app-header-layout.js';
import '@polymer/app-layout/app-header/app-header.js';
import '@polymer/app-layout/app-scroll-effects/effects/waterfall.js';
import '@polymer/app-layout/app-scroll-effects/effects/resize-title.js';
import '@polymer/app-layout/app-toolbar/app-toolbar.js';
import '@polymer/paper-icon-button/paper-icon-button.js';


class AppHeaderOverlay extends OverlayMixin(AppElement) {

  static get is() { return 'app-header-overlay'; }

  static get template() {
    return html([htmlString]);
  }


  static get properties() {
    return {

      // Will be main-title if not set explicitly.
      bottomToolbarText: {
        type: String,
        value: ''
      },

      // Whether to include a close button or not.
      closeButton: Boolean,

      // Scrollable content div ref used by app-shell overlay controller.
      content: Object,

      disableAutoSticky: Boolean, 

      // Defeat parallax and fade out
      disableBackgroundEffects: Boolean,

      disableCondense: {
        type: Boolean,
        value: false
      },

      disableParallax: Boolean,

      disableWarnings: Boolean,

      fixedHeader: Boolean,

      // Header panel ref used by this element and app-shell overlay controller.
      header: Object,

      // Number >= 1, determines toolbar quantity in header.
      headerSize: {
        type: Number,
        value: 1
      },

      noBackButton: Boolean,

      parentControlsExits: Boolean,

      // Reset scroll pos on every open.
      // Consumed by overlay-control-mixin.
      resetScroll: Boolean,

      revealHeader: Boolean,

      stickyBottomToolbar: {
        type: Boolean,
        value: false
      },

      // Pass through to app-header for 'threshold-triggered-changed' event.
      threshold: {
        type: Number,
        value: 0
      },

      // Toolbar main title.
      title: {
        type: String,
        value: 'Title'
      },

      // Put title in top toolbar.
      topTitle: Boolean,

      // Dom element cached for __setupToolbarButtonScrollAction.
      _bottomToolbarButtonsContainer: Object,

      // Bottom toolbar text div ref.
      _bottomToolbarTextDiv: Object,

      // Dom element cached for __setupToolbarButtonScrollAction.
      _fabContainer: Object,

      _headerFabPresent: Boolean,

      _headerHasTabs: Boolean,

      // Used for placing fab and parallax effect.
      _headerHeight: Number,

      // Header had more than 1 toolbar.
      _headerIsTall: {
        type: Boolean,
        computed: '__computeHeaderIsTall(headerSize)'
      },

      // Dynanically represents a percentage of scroll travel
      // allowed before the bottom toolbar buttons and fab hide,
      // based off header height.
      _headerScrollThreshold: {
        type: Number,
        computed: '__computeHeaderScrollThreashold(headerSize)'
      },

      // Used to dynamically apply app-header effects without console warnings.
      _titleDiv: Object,

      // Ref for dynamically created (inside dom-if) 
      // toolbar background slot container.
      _toolbarBackgroundContainer: Object,

      // Opacity gradient image overlay.
      _toolbarBackgroundVignette: Object,

      // Ref for oversized div inside _toolbarBackgroundContainer 
      // that is translated on scroll to give parallax behavior
      // used for the background slot.
      _toolbarBackgroundParallax: Object,

      // Dynamically measure header height in 
      // case consumer changes the header size.
      _toolbarBackgroundParallaxHeight: Number,

      // Controls the container's css display prop.
      _toolbarBackgroundNodePresent: Boolean,

      // Used to control background state when fully faded out.
      _toolbarBackgroundNotDisplayed: Boolean,

      // Parallax container is taller than its parent div
      // translating it from centered (0px) to half this difference
      // which is the half the difference between parallax and header.
      _parallaxTravel: {
        type: Number,
        computed: '__computeParallaxTravel(_toolbarBackgroundParallaxHeight, _headerHeight)'
      }

    };
  }


  static get observers() {
    return [
      '__setHeaderBackgroundContainerDisplay(_toolbarBackgroundNodePresent, _toolbarBackgroundContainer)',
      '__bottomToolbarContentChanged(bottomToolbarText, _headerHasTabs, header, _titleDiv, _bottomToolbarTextDiv, topTitle)',
      '__setStickyToolbar(stickyBottomToolbar, disableAutoSticky, _headerHasTabs, header, _topToolbar, _bottomToolbar)',
      '__disableCondenseChanged(condenseHeader)',
      '__fixedHeaderChanged(fixedHeader)',
      '__revealHeaderChanged(revealHeader)',
      '__disableParallaxChanged(disableParallax)'
    ];
  }


  constructor() {

    super();

    this.__scrollHandler = this.__scrollHandler.bind(this);
  }


  connectedCallback() {

    super.connectedCallback();
    
    this.__setupAfterDomIfStamps();
  }


  disconnectedCallback() {

    super.disconnectedCallback();

    document.removeEventListener('scroll', this.__scrollHandler);
  }


  __computeBottomTitleClass(bottomToolbarText) {

    return bottomToolbarText ? '' : 'title title-margin';
  }


  __computeBottomToolbarText(bottomToolbarText, title, topTitle) {

    if (topTitle) { return bottomToolbarText; }
    
    return bottomToolbarText ? bottomToolbarText : title;
  }

  
  __computeHeaderIsTall(headerSize) {

    if (headerSize === undefined) { return; }

    return headerSize > 1;
  }


  __computeHeaderScrollThreashold(headerSize) {

    if (headerSize === undefined) { return; }

    return 1 - (1 / headerSize);
  }


  __computeParallaxTravel(parallaxHeight, headerHeight) {

    if (parallaxHeight === undefined || headerHeight === undefined) { return; }

    return (parallaxHeight - headerHeight) / 2;
  }


  __setHeaderAttribute(bool, attr) {

    if (bool === undefined) { return; }

    if (!this.header) { return; }

    if (bool) {
      this.header.setAttribute(attr, true);
    }
    else {
      this.header.removeAttribute(attr);
    }
  }


  __disableCondenseChanged(bool) {

    this.__setHeaderAttribute(!bool, 'condenses');
  }


  __fixedHeaderChanged(bool) {

    this.__setHeaderAttribute(bool, 'fixed');
  }


  __revealHeaderChanged(bool) {

    this.__setHeaderAttribute(bool, 'reveals');
  }


  __disableParallaxChanged(bool) {

    if (!bool) { return; }

    this.updateStyles({
      '--header-background-parallax-height': '100%'
    });
  }

  // Imperitively set header effects to avoid warnings from app-header effects engine.
  __bottomToolbarContentChanged(bottomToolbarText, headerHasTabs, header, title, container, topTitle) {

    if (!header || !title || !container) { return; }

    if (bottomToolbarText || headerHasTabs || topTitle) {
      header.setAttribute('effects', 'waterfall');
      title.removeAttribute('condensed-title');
      container.removeAttribute('main-title');
    }
    else {
      title.setAttribute('condensed-title', true);
      container.setAttribute('main-title', true);
      header.setAttribute('effects', 'waterfall resize-title');
    }
  }


  __setStickyToolbar(stickyBottomToolbar, disableAutoSticky, headerHasTabs, header, topToolbar, bottomToolbar) {

    if (!header || !topToolbar || !bottomToolbar) { return; }

    if ((stickyBottomToolbar || headerHasTabs) && !disableAutoSticky) {
      header.setAttribute('fixed', true);
      topToolbar.removeAttribute('sticky');
      bottomToolbar.setAttribute('sticky', true);
    }
    else {
      header.removeAttribute('fixed');
      topToolbar.setAttribute('sticky', true);
      bottomToolbar.removeAttribute('sticky');
    }
  }


  __setHeaderBackgroundContainerDisplay(headerHasBackgroundContent, container) {

    if (container === undefined) { return; }

    if (headerHasBackgroundContent) {
      container.style.display = 'flex';
    } 
    else {
      container.style.display = 'none';
    }
  }


  __setupAfterDomIfStamps() {

    const domChangeHandler = async event => {

      const templateId = getRootTarget(event).id;

      if (templateId === 'smallHeaderDomIf' || templateId === 'tallHeaderDomIf') {

        this.removeEventListener('dom-change', domChangeHandler);
        
        this.header  = this.select('#overlayHeader');
        this.content = this.select('#overlayContent');        
        this.__setHeaderAttribute(!this.disableCondense, 'condenses');
        this.__setHeaderAttribute(this.fixedHeader,      'fixed');
        this.__setHeaderAttribute(this.revealHeader,     'reveals');

        if (templateId === 'tallHeaderDomIf') {

          const bottomToolbarButtonsPresent  = this.slotHasNodes('#bottomToolbarButtonsSlot');
          this._headerFabPresent             = this.slotHasNodes('#fabSlot');
          this._headerHasTabs                = this.slotHasNodes('#bottomToolbarTabsSlot');

          // Used to determing whether to run the 
          // '__controlToolbarBackgroundFade' method on the element.
          this._toolbarBackgroundNodePresent = this.slotHasNodes('#headerBackgroundSlot');
          this._toolbarBackgroundContainer   = this.select('#headerBackgroundSlotContainer');
          this._toolbarBackgroundParallax    = this.select('#headerBackgroundParallaxContainer');
          this._toolbarBackgroundVignette    = this.select('#headerBackgroundVignette');
          this._titleDiv                     = this.select('#overlayTitleDiv');
          this._bottomToolbarTextDiv         = this.select('#bottomToolbarTextDiv');
          this._topToolbar                   = this.select('#topToolbar');
          this._bottomToolbar                = this.select('#bottomToolbar');

          // Wait for full layout before measuring header.
          await schedule();

          this._headerHeight = this.header.getBoundingClientRect().height;

          if (bottomToolbarButtonsPresent) {
            this._bottomToolbarButtonsContainer = this.select('#bottomToolbarButtonsContainer');
          }

          if (this._headerFabPresent) {
            this._fabContainer = this.select('#fabContainer');
            this.__placeFab();
          }

          if (this.disableWarnings) { return; }

          if (bottomToolbarButtonsPresent && this._headerFabPresent) {
            console.warn(
              'app-header-overlay cannot have both bottom toolbar buttons and a header fab!  ', 
              'They dont both fit on small screens.'
            );
          }

          if (bottomToolbarButtonsPresent && this._headerHasTabs) {
            console.warn(
              'app-header-overlay cannot have both bottom toolbar buttons and bottom toolbar tabs!  ', 
              'They dont both fit on small screens.'
            );
          }

          if (this._headerHasTabs && this._headerFabPresent) {
            console.warn(
              'app-header-overlay cannot have both bottom toolbar tabs and a header fab!  ', 
              'They dont both fit on small screens.'
            );
          }

        }
      }
    };

    this.addEventListener('dom-change', domChangeHandler);
  }


  __placeFab() {

    const halfFabHeight = 28;
    const top           = this._headerHeight - halfFabHeight;
    this._fabContainer.style.top = `${top}px`;

    // Opacity hides flicker of fab before 
    // being correctly placed on the header.
    this._fabContainer.style.opacity = '1';
  }


  __toggleButtonsWithHeaderState(progress) {

    const threshold = progress > this._headerScrollThreshold;

    if (this._bottomToolbarButtonsContainer && !this.stickyBottomToolbar) {

      if (threshold) {
        this._bottomToolbarButtonsContainer.classList.add('fade-out');
      } 
      else {
        this._bottomToolbarButtonsContainer.classList.remove('fade-out');
      }
    } 
    else if (this._fabContainer) {

      if (threshold) {
        this._fabContainer.classList.add('shrink-to-hidden');
      } 
      else {
        this._fabContainer.classList.remove('shrink-to-hidden');
      }
    }
  }

  // Fade and parallax background on scroll.
  __controlToolbarBackgroundEffects(progress, top) {

    const fade     = progress <= 1 ? 1 - progress : 0;
    const parallax = this._parallaxTravel * progress;

    // Initial size is _headerHeight or scale(1) fade is 1.
    // Scrolled size is 64px or scale(1/headerSize) fade is 0.
    //
    // (headerSize - 1 * 1 / headerSize) + 1 / headerSize = 100%
    // (headerSize - 1 * 0 / headerSize) + 1 / headerSize = final%
    const size      = this.headerSize;
    const finalSize = 1 / size;
    const scale     = ((size - 1) * fade) / size + finalSize;

    this._toolbarBackgroundVignette.style.transform = `translateY(${top / 2}px) scaleY(${scale})`;
    this._toolbarBackgroundContainer.style.opacity  = `${fade}`;

    if (!this.disableParallax) {
      this._toolbarBackgroundParallax.style.transform = `translateY(${parallax}px)`;
    }

    if (this.bottomToolbarText) {
      const textFade = Math.pow(fade, 3);      
      this._bottomToolbarTextDiv.style.opacity = `${textFade}`;
    }

    // Kill all pointer and touch events if it's not visible.
    // 'pointer-events', 'touch-action' and 'display' css values do not
    // work on mobile Safari, so using z-index instead.
    //
    // Display has issues on iOS since resizable elements get a window resize
    // while their container has 0 height and width, thus they do not
    // properly measure when coming back into view.
    if (fade === 0) { 
      this._toolbarBackgroundNotDisplayed = true;
      this._toolbarBackgroundContainer.style['z-index'] = '-1';
    } 
    else if (this._toolbarBackgroundNotDisplayed) { // Dont call multiple times for perf.
      this._toolbarBackgroundNotDisplayed = false;
      this._toolbarBackgroundContainer.style['z-index'] = 'initial';
    }
  }


  __scrollSetup() {

    const {progress, top} = this.header.getScrollState();

    if (this._headerIsTall) {

      this.__toggleButtonsWithHeaderState(progress);

      if (this._toolbarBackgroundNodePresent && !this.disableBackgroundEffects) {

        this.__controlToolbarBackgroundEffects(progress, top);
      }
    }
  }


  __scrollHandler() {

    window.requestAnimationFrame(this.__scrollSetup.bind(this));
  }


  async __setupToolbarButtonScrollAction() {

    // Avoid race condition with first open and dom-if stamping.
    if (!this.header) { return; }

    if (this._fabContainer) {

      // Toggled on with every open and off on reset.
      this._fabContainer.style.willChange = 'transform';
    }

    if (this._headerIsTall) {
      this._toolbarBackgroundParallaxHeight = 
        this._toolbarBackgroundParallax.getBoundingClientRect().height;
    }

    // Wait for header to finish scrolling.
    await schedule();

    document.addEventListener('scroll', this.__scrollHandler);

    this.__scrollSetup();
  }


  __createMiddleToolbars(headerSize) {

    if (headerSize < 3) { return []; }

    const middleToobarCount = headerSize - 2;
    const slots             = [];

    for (let i = 0; i < middleToobarCount; i += 1) {
      slots.push({slotName: `middle-toolbar-${i}-slot`})
    }

    return slots;
  }


  __headerThresholdTriggered(event) {

    this.fire('header-overlay-threshold-triggered-changed', event.detail);
  }

  // Called by overlay-control-mixin if resetScroll is true.
  resetHeaderParallaxContainer() {

    if (!this._toolbarBackgroundVignette) { return; }

    this._toolbarBackgroundVignette.style.transform = '';
    this._toolbarBackgroundContainer.style.opacity  = '1';  
    this._toolbarBackgroundParallax.style.transform = '';
    this._bottomToolbarTextDiv.style.opacity        = '1';
  }

  // Remeasure header height, and place fab before opening
  // in case header is imported but not immediately opened
  // where heaer height is always zero, throwing off fab placement and
  // parallax effect.
  __preOpenImplementation() {

    this._headerHeight  = this.header.getBoundingClientRect().height;

    if (this._headerFabPresent) {
      this.__placeFab();
    }

    return Promise.resolve();
  }

  // Overwriting overlay-mixin method.
  __postOpenImplementation() {

    this.__setupToolbarButtonScrollAction();

    return Promise.resolve();
  }

  // Overwriting overlay-mixin method.
  __resetImplementation() {

    if (this._fabContainer) {
      this._fabContainer.style.willChange = 'auto';
    }

    document.removeEventListener('scroll', this.__scrollHandler);
  }


  async __backButtonClicked(event) {

    try {
      await this.clicked();

      if (this.parentControlsExits) {

        this.fire('header-overlay-back', {clickEvent: event, node: this});

        return;
      }

      return this.back();
    }
    catch (error) {
      if (error === 'click debounced') { return; }
      console.error(error);
    }
  }


  async __closeButtonClicked(event) {

    try {
      await this.clicked();

      if (this.parentControlsExits) {

        this.fire('header-overlay-close', {clickEvent: event, node: this});

        return;
      }

      return this.close();
    }
    catch (error) {
      if (error === 'click debounced') { return; }
      console.error(error);
    }
  }
  
}

window.customElements.define(AppHeaderOverlay.is, AppHeaderOverlay);
