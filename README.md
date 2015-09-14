# text-gradient
[![npm-image](https://img.shields.io/npm/v/text-gradient.svg?style=flat-square)](https://www.npmjs.com/package/text-gradient)

*Vanilla js version of [javierbyte's][0] – [react-textgradient][1].*

Apply gradient effects to text with CSS, inline SVG mask fallback or a solid color as last resort.

**Note:** Not recommended for large amounts of text, suitable for headlines.

## Features
- Uses CSS text gradients when possible (Chrome, Safari, iOS, android).
- Fallbacks to SVG masking on Firefox `url(#gradient)`.
- The text remains controlled via CSS (font size, family, weight, align, spacing,  etc...)

[0]: https://github.com/javierbyte
[1]: https://github.com/javierbyte/react-textgradient

## Install
```sh
npm install text-gradient --save
```

## Usage 

```
@argument element <required> [NodeElement] the element to apply the gradient
@argument options <optional> [Object] Gradient color-stops, direction, text.
```

```js
var TextGradient = require('text-gradient');

var MyGradient = TextGradient(document.getElementById('headline'), {
	from : '#B0E537',
	to : '#009DE9',                                                          
	direction : 'right'
});
```

## Options

| name | type | default | description
|:--- |:--- |:---|:---
text | String | `element.textContent` | The text to display
from | String (valid color format) | `transparent` | Gradient's first color-stop
to | String (valid color format) | `transparent` | Gradient's last color-stop
direction | String | `right` | One of `top|right|bottom|left`


## API
### updateText(String)

Changes the text contents.

```js
/* 
 * @argument text <required> [String] 
 * @return undefined
 */
MyGradient.updateText('Some other catchy headline');
```

### destroy()

Remove the text-gradient effect, references and elements created by the instance (svg container, defs, extra spans to wrap the content, etc).

```js
/* 
 * @return null
 */
MyGradient = MyGradient.destroy();
```

## License
MIT © [Noel Delgado](http://pixelia.me/)