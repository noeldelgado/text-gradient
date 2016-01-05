/* @module TextGradientSVG
 * text-gradient v0.2.0
 */
(function(factory) {
  'use strict';
  if (typeof exports === 'object') {
    module.exports = factory();
  } else {
    window.TextGradientSVG = factory();
  }
}(function factory() {
  'use strict';
  return {
    __wrapperElement: null,
    __textElement: null,
    __maskedClone: null,

    /* Initialize.
     * @override, private, abstract
     */
    _init: function _init() {
      this.__wrapperElement = document.createElement('span');
      this.__textElement = document.createElement('span');

      this._include(this.__wrapperElement.style, {
        position: 'relative',
        display: 'inline-block',
        color: this.options.fallbackColor || this.options.to
      });

      this.__createGradient();
      this.__createMaskedClone();
      this.__wrapperElement.appendChild(this.__textElement);

      this.updateText(this.options.text);
      this.element.appendChild(this.__wrapperElement);
    },

    /* Creates the SVG Mask and Gradient that will be applied to the element.
     * @private
     */
    __createGradient: function __createGradient() {
      var svgMaskString = "" +
        "<mask id='tg-mask-" + this._id +"'  maskContentUnits='objectBoundingBox'>" +
          "<linearGradient id='tg-linear-"+ this._id +"' {coords}>" +
            "<stop stop-color='white' offset='0'/>" +
            "<stop stop-color='white' stop-opacity='0' offset='1'/>" +
          "</linearGradient>" +
          "<rect x='0' y='0' width='1' height='1' fill='url(#tg-linear-"+ this._id +")'/>" +
        "</mask>";

      switch(this.options.direction) {
        case 'top': svgMaskString = svgMaskString.replace(/{coords}/, "x1='0' x2='0' y1='1' y2='0'"); break;
        case 'bottom': svgMaskString = svgMaskString.replace(/{coords}/, "x1='0' x2='0' y1='0' y2='1'"); break;
        case 'left': svgMaskString = svgMaskString.replace(/{coords}/, "x1='1' x2='0' y1='0' y2='0'"); break;
        default: svgMaskString = svgMaskString.replace(/{coords}/, "x1='0' x2='1' y1='0' y2='0'"); break;
      }

      this._svgDefsContainer.insertAdjacentHTML('afterbegin', svgMaskString);
    },

    /* Creates a new element to apply the masking.
     * @private
     */
    __createMaskedClone: function __createMaskedClone() {
      this.__maskedClone = document.createElement('span');

      this._include(this.__maskedClone.style, {
        mask: 'url(#tg-mask-' + this._id +')',
        color: this.options.from,
        position: 'absolute',
        left: 0
      });

      this.__wrapperElement.appendChild(this.__maskedClone);
    },

    /* Implementation to update the text contents of this.element keeping the gradient intact.
     * @override, public, abstract
     */
    updateText: function updateText(text) {
      if (this._destroyed === true) {
        return console.warn('TextGradient: calling on destroyed object');
      }

      this.options.text = text;
      this.__textElement.textContent = text;
      this.__maskedClone.textContent = text;
    },

    /* Implementation to remove the gradient and created elements.
     * @override, public, abstract
     */
    destroy: function destroy() {
      if (this._destroyed === true) {
        return console.warn('TextGradient: calling on destroyed object');
      }

      var svgMaskElement = document.getElementById('tg-mask-' + this._id);
      this._svgDefsContainer.removeChild(svgMaskElement);

      while(this.element.childNodes.length > 0) {
        this.element.removeChild(this.element.childNodes[0]);
      }
      this.element.textContent = this.options.text;

      this.element = null;
      this.options = null;
      this.__wrapperElement = null;
      this.__textElement = null;
      this.__maskedClone = null;
      this._svgDefsContainer = null;
      this._destroyed = true;
    }
  };
}));
