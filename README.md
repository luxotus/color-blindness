# Color Blindness Tool

Tool to help you view your site as a user with a color deficiency. Giving you confidence that your site is readable for all users.

## Getting Started

To build toggle at the top of page between color deficiencies
```javascript
  // init(Toggle location, embed css)
  // toggle location: "left", "right", "center"
  // true: have js embed css, false: your including the prebuilt css file
  colorBlindnessTool.init('center', true);
```

Converting color by a given deficiency.
Supported colors: rgb, rgba, hex, and web color names
```javascript
  // Normal
  colorBlindnessTool.convertColor('rgb(255, 0, 0)', 'Normal')

  // Protanopia
  colorBlindnessTool.convertColor('blue', 'Protanopia')

  // Protanomaly
  colorBlindnessTool.convertColor('#0000ff', 'Protanomaly')

  // Deuteranopia
  colorBlindnessTool.convertColor('#F00', 'Deuteranopia')

  // Deuteranomaly
  colorBlindnessTool.convertColor('#FF0000E2', 'Deuteranomaly')

  // Tritanopia
  colorBlindnessTool.convertColor('rgba(255, 67, 32, 0.57)', 'Tritanopia')

  // Tritanomaly
  colorBlindnessTool.convertColor('rgb(255, 140, 78)', 'Tritanomaly')

  // Achromatopsia
  colorBlindnessTool.convertColor('gold', 'Achromatopsia')

  // Achromatically
  colorBlindnessTool.convertColor('olive', 'Achromatically')
```

To convert whole page to a given color deficiency
```javascript
  colorBlindnessTool.convertDom('Protanopia');
```

To convert an element to a given color deficiency
```javascript
  const element = document.querySelector(".title");
  colorBlindnessTool.convertElement(element, 'Deuteranomaly');
```

Also made our rgb color converter accessible, just incase you need to turn a color to its rgb equivalent
```javascript
  colorBlindnessTool.convertRGB('#f2d'); // rgb(255, 34, 221)
  colorBlindnessTool.convertRGB('wheat'); // rgb(245, 222, 179)
```