(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
/**
 * text-gradient v0.2.0
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
     * @property _id <protected, static> [Number]
     */
    TextGradient._id = 0;

    /* Holds the implementation Object to be included to the main Class.
     * @property _implementation <protected, static> [Object] TextGradientDefault
     */
    TextGradient._implementation = TextGradientDefault;

    /* Checks if the implementation needs to be changed.
     * @method _updateImplementation <protected, static> [Function]
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
     * @helper _include <private> [Function]
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
     * @argument element <required> [NodeElement] (undefined) Element to apply the text gradient effect.
     * @argument options <optional> [Object] (see defaults) Gradient color-stops, gradient-direction, text.
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
            text : this.element.textContent,
            from : 'transparent',
            to : 'transparent',
            direction : 'right',
            fallbackColor : ''
        }, config);

        this.element.textContent = '';
        this._init();

        return this;
    }

    TextGradient.prototype = {
        _destroyed : false,

        /* Initialize.
         * All implementations should include this method.
         * @method _init <private, abstract>
         */
        _init : function _init() {
            throw new Error('TextGradient.prototype._init not implemented');
        },

        /* Implementation to update the text contents of this.element keeping the gradient intact.
         * All implementations should include this method.
         * @method updateText <public, abstract> [Function]
         */
        updateText : function updateText() {
            throw new Error('TextGradient.prototype.update not implemented');
        },

        /* Implementation to remove the gradient and created elements.
         * All implementations should include this method.
         * @method destroy <public, abstract> [Function]
         */
        destroy : function destroy() {
            throw new Error('TextGradient.properties.destroy not implemented');
        }
    };

    /* Sets the implementation and includes its methods/properties */
    TextGradient._updateImplementation();
    _include(TextGradient.prototype, TextGradient._implementation);

    return TextGradient;
}));

},{"./text-gradient-default":2,"./text-gradient-svg":3}],2:[function(require,module,exports){
/*
 * @module TextGradientDefault
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
        updateText : function updateText(text) {
            if (this._destroyed === true) {
                return console.warn('TextGradient: calling on destroyed object');
            }

            this.__wrapperElement.textContent = this.options.text = text;
        },

        /* Implementation to remove the gradient and created elements.
         * @method destroy <public, abstract> [Function]
         */
        destroy : function destroy() {
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

},{}],3:[function(require,module,exports){
/*
 * @module TextGradientSVG
 * text-gradient v0.2.0
 */
(function(factory) { 'use strict';
    if (typeof exports === 'object') {
        module.exports = factory();
    } else {
        window.TextGradientSVG = factory();
    }
}(function factory() { 'use strict';
     return {
        __wrapperElement : null,
        __textElement : null,
        __maskedClone : null,

        /* Initialize.
         * @method _init <private, abstract>
         */
        _init : function _init() {
            this.__wrapperElement = document.createElement('span');
            this.__textElement = document.createElement('span');

            this._include(this.__wrapperElement.style, {
                position : 'relative',
                display : 'inline-block',
                color : this.options.fallbackColor || this.options.to,
            });

            this.__createGradient();
            this.__createMaskedClone();
            this.__wrapperElement.appendChild(this.__textElement);

            this.updateText(this.options.text);
            this.element.appendChild(this.__wrapperElement);
        },

        /* Creates the SVG Mask and Gradient that will be applied to the element.
         * @method __createGradient <private> [Function]
         */
        __createGradient : function __createGradient() {
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
         * @method __createMaskedClone <private> [Function]
         */
        __createMaskedClone : function __createMaskedClone() {
            this.__maskedClone = document.createElement('span');

            this._include(this.__maskedClone.style, {
                mask : 'url(#tg-mask-' + this._id +')',
                color : this.options.from,
                position : 'absolute',
                left : 0,
            });

            this.__wrapperElement.appendChild(this.__maskedClone);
        },

        /* Implementation to update the text contents of this.element keeping the gradient intact.
         * @method updateText <public, abstract> [Function]
         */
        updateText : function updateText(text) {
            if (this._destroyed === true) {
                return console.warn('TextGradient: calling on destroyed object');
            }

            this.options.text = text;
            this.__textElement.textContent = text;
            this.__maskedClone.textContent = text;
         },

        /* Implementation to remove the gradient and created elements.
         * @method destroy <public, abstract> [Function]
         */
        destroy : function destroy() {
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

},{}],4:[function(require,module,exports){
var TextGradient = require('text-gradient');

new TextGradient(document.getElementById('demo-cedarville'), {
    from: 'grey',
    direction: 'bottom'
});

new TextGradient(document.getElementById('demo-headline'), {
    from: '#6B6ED8',
    to: '#4AC5C3'
});

new TextGradient(document.getElementById('demo-big-letters'), {
    from: '#D27B9D',
    to: '#4075A8',
    direction: 'top'
});


},{"text-gradient":1}]},{},[4]);
