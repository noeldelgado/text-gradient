/* text-gradient v0.2.0
 * https://github.com/noeldelgado/text-gradient
 * License MIT
 */
(function(factory) {
  'use strict';
  if (typeof exports === 'object') {
    module.exports = factory(
      require('./text-gradient-default'),
      require('./text-gradient-svg')
    );
  } else {
    window.TextGradient = factory(
      window.TextGradientDefault,
      window.TextGradientSVG
    );
  }
}(function factory(TextGradientDefault, TextGradientSVG) {
  'use strict';
  TextGradient.version = '0.2.0';

  /* Instances id counter, increased by the constructor Class.
   * Used to generate unique IDs for the SVG implementation.
   * @static, protected
   * @property {number} _id
   */
  TextGradient._id = 0;

  /* Holds the implementation Object to be included to the main Class.
   * @static, protected
   * @property {Object} _implementation
   */
  TextGradient._implementation = TextGradientDefault;

  /* Checks if the implementation needs to be changed.
   * @static, protected
   */
  TextGradient._updateImplementation = function _updateImplementation() {
    if (('WebkitTextFillColor' in document.documentElement.style) === false) {
      this._implementation = TextGradientSVG;
      document.body.insertAdjacentHTML('afterbegin', "<svg id='tg-svg-container' height='0' width='0' style='position:absolute'><defs></defs></svg>");
      this._svgDefsContainer = document.getElementById('tg-svg-container').getElementsByTagName('defs')[0];
    }
  };

  TextGradient._svgDefsContainer = null;

  /* Merge the contents of two or more objects together into the first object.
   * @private _include
   */
  function _include(a, b) {
    var property;
    for (property in b) {
      if (b.hasOwnProperty(property)) {
        a[property] = b[property];
      }
    }
    return a;
  }

  /* Main Class. Holds the behaviour that can run on all implementations.
   * This class allows to extend the behavior through a strategy of module inclusion.
   * That is that once feature support is determined, the module that holds the specific behaviour is included into the class.
   * @param {NodeElement} element - Element to apply the text gradient effect.
   * @param {Object} [config] - Gradient color-stops, gradient-direction, text.
   */
  function TextGradient(element, config) {
    if ((element.nodeType > 0) === false) {
      throw new Error('TextGradient [constructor]: "element" param should be a NodeElement');
    }

    this.element = element;

    this._id = TextGradient._id++;
    this._svgDefsContainer = TextGradient._svgDefsContainer;
    this._include = _include;

    this.options = _include({
      text: this.element.textContent,
      from: 'transparent',
      to: 'transparent',
      direction: 'right',
      fallbackColor: ''
    }, config);

    this.element.textContent = '';
    this._init();

    return this;
  }

  TextGradient.prototype = {
    _destroyed: false,

    /* Initialize.
     * All implementations should include this method.
     * @private, abstract
     */
    _init: function _init() {
      throw new Error('TextGradient.prototype._init not implemented');
    },

    /* Implementation to update the text contents of this.element keeping the gradient intact.
     * All implementations should include this method.
     * @public, abstract
     */
    updateText: function updateText() {
      throw new Error('TextGradient.prototype.update not implemented');
    },

    /* Implementation to remove the gradient and created elements.
     * All implementations should include this method.
     * @public, abstract
     */
    destroy: function destroy() {
      throw new Error('TextGradient.properties.destroy not implemented');
    }
  };

  /* Sets the implementation and includes its methods/properties */
  TextGradient._updateImplementation();
  _include(TextGradient.prototype, TextGradient._implementation);

  return TextGradient;
}));
