/*
 * @module TextGradientDefault
 * text-gradient v0.1.0
 */
(function(factory) { 'use strict';
    if (typeof exports === 'object') {
        module.exports = factory();
    } else {
        window.TextGradientDefault = factory();
    }
}(function factory() { 'use strict';
     return {
        __wrapperElement : null,

        /* Initialize.
         * @method _init <private, abstract>
         */
        _init : function _init() {
            this.__wrapperElement = document.createElement('span');

            this._include(this.__wrapperElement.style, {
                display : 'inline-block',
                color : this.options.fallbackColor || this.options.to,
                background : '-webkit-linear-gradient(' + this.options.direction + ', ' + this.options.to + ',' + this.options.from + ')',
                webkitBackgroundClip : 'text',
                webkitTextFillColor : 'transparent'
            });

            this.updateText(this.options.text);
            this.element.appendChild(this.__wrapperElement);
         },

        /* Implementation to update the text contents of this.element keeping the gradient intact.
         * @method updateText <public, abstract> [Function]
         */
        updateText : function updateText(value) {
            this.__wrapperElement.textContent = value;
         }
     };
}));
