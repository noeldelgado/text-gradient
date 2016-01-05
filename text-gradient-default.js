/* @module TextGradientDefault
 * text-gradient v0.2.0
 */
(function(factory) {
  'use strict';
  if (typeof exports === 'object') {
    module.exports = factory();
  } else {
    window.TextGradientDefault = factory();
  }
}(function factory() {
  'use strict';
  return {
    __wrapperElement: null,

    /* Initialize.
     * @override, private, abstract
     */
    _init: function _init() {
      this.__wrapperElement = document.createElement('span');

      this._include(this.__wrapperElement.style, {
        display: 'inline-block',
        color: this.options.fallbackColor || this.options.to,
        background: '-webkit-linear-gradient(' + this.options.direction + ', ' + this.options.to + ',' + this.options.from + ')',
        webkitBackgroundClip: 'text',
        webkitTextFillColor: 'transparent'
      });

      this.updateText(this.options.text);
      this.element.appendChild(this.__wrapperElement);
    },

    /* Implementation to update the text contents of this.element keeping the gradient intact.
     * @override, public, abstract
     */
    updateText: function updateText(text) {
      if (this._destroyed === true) {
        return console.warn('TextGradient: calling on destroyed object');
      }
      this.__wrapperElement.textContent = this.options.text = text;
    },

    /* Implementation to remove the gradient and created elements.
     * @method destroy <public, abstract> [Function]
     */
    destroy: function destroy() {
      if (this._destroyed === true) {
        return console.warn('TextGradient: calling on destroyed object');
      }

      while(this.element.childNodes.length > 0) {
        this.element.removeChild(this.element.childNodes[0]);
      }
      this.element.textContent = this.options.text;

      this.element = null;
      this.options = null;
      this.__wrapperElement = null;
      this._destroyed = true;
      return null;
    }
  };
}));
