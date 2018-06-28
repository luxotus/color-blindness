/* eslint linebreak-style: ["error", "windows"] */
/* eslint wrap-iife: ["error", "any"] */
/* eslint func-names: ["error", "never"] */
/* eslint no-unused-vars: ["error", { "vars": "local" }] */
/* eslint prefer-destructuring: ["error", {VariableDeclarator: {object: true}}] */
/* eslint no-unused-vars: ["error", { "varsIgnorePattern": "colorBlindnessTool" }] */
/* eslint no-bitwise: ["error", { "allow": ["&", ">>"] }] */

const colorBlindnessTool = (function () {
  let domColorUpdated = false;
  const colorDeficiencies = {
    Normal: 'Normal',
    'Red-Weak/Protanomaly': 'Protanomaly',
    'Green-Weak/Deuteranomaly': 'Deuteranomaly',
    'Blue-Weak/Tritanomaly': 'Tritanomaly',
    'Red-Blind/Protanopia': 'Protanopia',
    'Green-Blind/Deuteranopia': 'Deuteranopia',
    'Blue-Blind/Tritanopia': 'Tritanopia',
    'Monochromacy/Achromatopsia': 'Achromatopsia',
    Achromatically: 'Achromatically',
  };
  const originalElements = [];

  /**
   * Private function for building toggle using js
   * @returns {string} html with inline css
   */
  const buildColorToggle = function (setStyle, togglePosition) {
    const colorToggleHtml = '<div id="color-deficiency-holder"><div id="deficiency-button-lt" class="deficiency-button"><div class="deficiency-arrow-lt"></div></div><div id="deficiency-txt">Deficiency</div><div id="deficiency-button-rt" class="deficiency-button"><div class="deficiency-arrow-rt"></div></div></div>';
    const toggle = {
      html: colorToggleHtml,
      arrowLeftBtn: 'deficiency-button-lt',
      arrowRightBtn: 'deficiency-button-rt',
      txtId: 'deficiency-txt',
    };
    let colorToggleStyle = '';
    let stylePosition = '';

    if (setStyle) {
      if (typeof togglePosition === 'string') {
        if (togglePosition === 'left') {
          stylePosition = 'left:0;';
        } else if (togglePosition === 'right') {
          stylePosition = 'right:0;';
        } else {
          stylePosition = 'left:0;right:0;';
        }
      } else {
        stylePosition = 'left:0;right:0;';
      }

      const selectors = {
        '#color-deficiency-holder': `display:block;z-index:99999999;height:35px;width:350px;position:absolute;top:0;margin:auto;${stylePosition}border:1px solid #b7b7b7;border-top:none;border-bottom-left-radius:5px;border-bottom-right-radius:5px;background-color:#fff;`,
        '.deficiency-button': 'position:relative;display:flex;align-items:center;justify-content:center;height:100%;width:25px;float:left;cursor:pointer;',
        '.deficiency-arrow-lt': 'height:5px;width:5px;border-top:2px solid gray;border-right:2px solid gray;transform:rotate(-135deg);',
        '.deficiency-arrow-rt': 'height:5px;width:5px;border-top:2px solid gray;border-right:2px solid gray;transform:rotate(45deg);',
        '#deficiency-txt': 'height:100%;width:300px;position:relative;float:left;line-height:35px;font-size:20px;font-weight:bold;text-align:center;letter-spacing:0.5px;',
      };

      Object.entries(selectors).forEach((entry) => {
        colorToggleStyle += `${entry[0]} {${entry[1]}}`;
      });

      toggle.style = colorToggleStyle;
    }

    return toggle;
  };

  const anomalize = function (a, b) {
    const v = 1.75;
    const d = v * 1 + 1;
    const color = [];

    if (a.length === b.length) {
      for (let index = 0; index < a.length; index += 1) {
        color.push((v * b[index] + a[index] * 1) / d);
      }
    }

    return color;
  };

  const monochrome = function (r) {
    const z = Math.round(r[0] * 0.299 + r[1] * 0.587 + r[2] * 0.114);

    return [
      z,
      z,
      z,
    ];
  };

  const getRGBFromXYZ = function (x, y, z) {
    return {
      r: (3.063218 * x - 1.393325 * y - 0.475802 * z),
      g: (-0.969243 * x + 1.875966 * y + 0.041555 * z),
      b: (0.067871 * x - 0.228834 * y + 1.069251 * z),
    };
  };

  const blindMK = function (r, t) {
    const gamma = 2.2;
    const wx = 0.312713;
    const wy = 0.329016;
    const wz = 0.358271;
    const blue = (r[2] / 255) ** gamma;
    const green = (r[1] / 255) ** gamma;
    const red = (r[0] / 255) ** gamma;
    const c = {
      x: (0.430574 * red + 0.341550 * green + 0.178325 * blue),
      y: (0.222015 * red + 0.706655 * green + 0.071330 * blue),
      z: (0.020183 * red + 0.129553 * green + 0.939180 * blue),
      u: 0,
      v: 0,
    };
    const sumXYZ = c.x + c.y + c.z;
    const rBlind = {
      protan: {
        cpx: 0.7465,
        cpy: 0.2535,
        am: 1.273463,
        ayi: -0.073894,
      },
      deutan: {
        cpx: 1.40,
        cpy: -0.40,
        am: 0.968437,
        ayi: 0.003331,
      },
      tritan: {
        cpx: 0.1748,
        cpy: 0.000,
        am: 0.062921,
        ayi: 0.292119,
      },
    };

    if (sumXYZ !== 0) {
      c.u = c.x / sumXYZ;
      c.v = c.y / sumXYZ;
    }

    let slope;
    const nx = wx * c.y / wy;
    const nz = wz * c.y / wy;
    const s = {};
    const d = {
      y: 0,
    };

    if (c.u < rBlind[t].cpx) {
      slope = (rBlind[t].cpy - c.v) / (rBlind[t].cpx - c.u);
    } else {
      slope = (c.v - rBlind[t].cpy) / (c.u - rBlind[t].cpx);
    }

    const clyi = c.v - c.u * slope;
    d.u = (rBlind[t].ayi - clyi) / (slope - rBlind[t].am);
    d.v = (slope * d.u) + clyi;

    s.x = d.u * c.y / d.v;
    s.y = c.y;
    s.z = (1 - (d.u + d.v)) * c.y / d.v;
    s.color = getRGBFromXYZ(s.x, s.y, s.z);

    d.x = nx - s.x;
    d.z = nz - s.z;
    d.color = getRGBFromXYZ(d.x, d.y, d.z);

    const adjr = d.color.r ? ((s.color.r < 0 ? 0 : 1) - s.color.r) / d.color.r : 0;
    const adjg = d.color.g ? ((s.color.g < 0 ? 0 : 1) - s.color.g) / d.color.g : 0;
    const adjb = d.color.b ? ((s.color.b < 0 ? 0 : 1) - s.color.b) / d.color.b : 0;
    const adjSample = [
      ((adjr > 1 || adjr < 0) ? 0 : adjr),
      ((adjg > 1 || adjg < 0) ? 0 : adjg),
      ((adjb > 1 || adjb < 0) ? 0 : adjb),
    ];
    const adjust = Math.max(...adjSample);

    s.color.r += (adjust * d.color.r);
    s.color.g += (adjust * d.color.g);
    s.color.b += (adjust * d.color.b);

    function gammaCorrection(colorValue) {
      let total = 0;

      if (colorValue > 0) {
        total = (colorValue >= 1) ? 1 : colorValue ** (1 / gamma);
      }

      return 255 * total;
    }

    const finalColor = {
      red: gammaCorrection(s.color.r),
      green: gammaCorrection(s.color.g),
      blue: gammaCorrection(s.color.b),
    };

    return [
      finalColor.red,
      finalColor.green,
      finalColor.blue,
    ];
  };

  /**
   * Convert color to a specified color deficiency and convert it into specified deficiency
   * Source of the original code can be found here http://web.archive.org/web/20090318054431/http://www.nofunc.com/Color_Blindness_Library
   * Original source code has needed major modifications, source code breaks with multiple errors.
   * Also did the research and adjusted copunctal point u -> x & v -> y coordinate. https://www.researchgate.net/publication/228970453_Multispectral_Analysis_of_Color_Vision_Deficiency_Tests?_sg=YIBGSXUXc4OmrRau6DXvjSTp6_1mEKWU_us2d2hZCc2FLIRCIaDi6J94kWEIz0d15I8QRThk3A
   *
   * @param {string} color
   * @param {string} deficiency
   * @returns {string} converted rgb()
   */
  const convertColorToDeficiency = function (color, deficiency) {
    const fBlind = {
      Normal(v) {
        return v;
      },
      Protanopia(v) {
        return blindMK(v, 'protan');
      },
      Protanomaly(v) {
        return anomalize(v, blindMK(v, 'protan'));
      },
      Deuteranopia(v) {
        return blindMK(v, 'deutan');
      },
      Deuteranomaly(v) {
        return anomalize(v, blindMK(v, 'deutan'));
      },
      Tritanopia(v) {
        return blindMK(v, 'tritan');
      },
      Tritanomaly(v) {
        return anomalize(v, blindMK(v, 'tritan'));
      },
      Achromatopsia(v) {
        return monochrome(v);
      },
      Achromatically(v) {
        return anomalize(v, monochrome(v));
      },
    };
    let rgbArr = [];
    let rgbStr = '';
    const colorMatches = color.match(/rgb[a]?\(([0-9]{1,3}), ([0-9]{1,3}), ([0-9]{1,3}),? ?(1|0|0\.[0-9]{1,})?\)/);
    let transparency = false;

    if (colorMatches.length && Object.prototype.hasOwnProperty.call(fBlind, deficiency)) {
      rgbArr = fBlind[deficiency]([
        parseInt(colorMatches[1], 10),
        parseInt(colorMatches[2], 10),
        parseInt(colorMatches[3], 10),
      ]);

      if (typeof colorMatches[4] !== 'undefined') {
        transparency = parseFloat(colorMatches[4], 10);
      } else {
        transparency = false;
      }

      rgbArr = rgbArr.map(x => Math.round(x));
    }

    if (transparency === false) {
      rgbStr = `rgb(${rgbArr[0]}, ${rgbArr[1]}, ${rgbArr[2]})`;
    } else {
      rgbStr = `rgba(${rgbArr[0]}, ${rgbArr[1]}, ${rgbArr[2]}, ${transparency})`;
    }

    return rgbStr;
  };

  /**
   * Source https://github.com/luxotus/color-contrast/blob/master/color-contrast.js
   * Grabs rgb values from color names
   *
   * @param {string} colorName - html defined color names
   * @returns {string} rgb(#,#,#)
  */
  const colorNamesToRGB = function (colorName) {
    let colorStr = '';
    const color = {
      aliceblue: 'rgb(240, 248, 255)',
      antiquewhite: 'rgb(250, 235, 215)',
      aqua: 'rgb(0, 255, 255)',
      aquamarine: 'rgb(127, 255, 212)',
      azure: 'rgb(240, 255, 255)',
      beige: 'rgb(245, 245, 220)',
      bisque: 'rgb(255, 228, 196)',
      black: 'rgb(0, 0, 0)',
      blanchedalmond: 'rgb(255, 235, 205)',
      blue: 'rgb(0, 0, 255)',
      blueviolet: 'rgb(138, 43, 226)',
      brown: 'rgb(165, 42, 42)',
      burlywood: 'rgb(222, 184, 135)',
      cadetblue: 'rgb(95, 158, 160)',
      chartreuse: 'rgb(127, 255, 0)',
      chocolate: 'rgb(210, 105, 30)',
      coral: 'rgb(255, 127, 80)',
      cornflowerblue: 'rgb(100, 149, 237)',
      cornsilk: 'rgb(255, 248, 220)',
      crimson: 'rgb(220, 20, 60)',
      cyan: 'rgb(0, 255, 255)',
      darkblue: 'rgb(0, 0, 139)',
      darkcyan: 'rgb(0, 139, 139)',
      darkgoldenrod: 'rgb(184, 134, 11)',
      darkgray: 'rgb(169, 169, 169)',
      darkgrey: 'rgb(169, 169, 169)',
      darkgreen: 'rgb(0, 100, 0)',
      darkkhaki: 'rgb(189, 183, 107)',
      darkmagenta: 'rgb(139, 0, 139)',
      darkolivegreen: 'rgb(85, 107, 47)',
      darkorange: 'rgb(255, 140, 0)',
      darkorchid: 'rgb(153, 50, 204)',
      darkred: 'rgb(139, 0, 0)',
      darksalmon: 'rgb(233, 150, 122)',
      darkseagreen: 'rgb(143, 188, 143)',
      darkslateblue: 'rgb(72, 61, 139)',
      darkslategray: 'rgb(47, 79, 79)',
      darkslategrey: 'rgb(47, 79, 79)',
      darkturquoise: 'rgb(0, 206, 209)',
      darkviolet: 'rgb(148, 0, 211)',
      deeppink: 'rgb(255, 20, 147)',
      deepskyblue: 'rgb(0, 191, 255)',
      dimgray: 'rgb(105, 105, 105)',
      dimgrey: 'rgb(105, 105, 105)',
      dodgerblue: 'rgb(30, 144, 255)',
      firebrick: 'rgb(178, 34, 34)',
      floralwhite: 'rgb(255, 250, 240)',
      forestgreen: 'rgb(34, 139, 34)',
      fuchsia: 'rgb(255, 0, 255)',
      gainsboro: 'rgb(220, 220, 220)',
      ghostwhite: 'rgb(248, 248, 255)',
      gold: 'rgb(255, 215, 0)',
      goldenrod: 'rgb(218, 165, 32)',
      gray: 'rgb(128, 128, 128)',
      grey: 'rgb(128, 128, 128)',
      green: 'rgb(0, 128, 0)',
      greenyellow: 'rgb(173, 255, 47)',
      honeydew: 'rgb(240, 255, 240)',
      hotpink: 'rgb(255, 105, 180)',
      indianred: 'rgb(205, 92, 92)',
      indigo: 'rgb(75, 0, 130)',
      ivory: 'rgb(255, 255, 240)',
      khaki: 'rgb(240, 230, 140)',
      lavender: 'rgb(230, 230, 250)',
      lavenderblush: 'rgb(255, 240, 245)',
      lawngreen: 'rgb(124, 252, 0)',
      lemonchiffon: 'rgb(255, 250, 205)',
      lightblue: 'rgb(173, 216, 230)',
      lightcoral: 'rgb(240, 128, 128)',
      lightcyan: 'rgb(224, 255, 255)',
      lightgoldenrodyellow: 'rgb(250, 250, 210)',
      lightgray: 'rgb(211, 211, 211)',
      lightgrey: 'rgb(211, 211, 211)',
      lightgreen: 'rgb(144, 238, 144)',
      lightpink: 'rgb(255, 182, 193)',
      lightsalmon: 'rgb(255, 160, 122)',
      lightseagreen: 'rgb(32, 178, 170)',
      lightskyblue: 'rgb(135, 206, 250)',
      lightslategray: 'rgb(119, 136, 153)',
      lightslategrey: 'rgb(119, 136, 153)',
      lightsteelblue: 'rgb(176, 196, 222)',
      lightyellow: 'rgb(255, 255, 224)',
      lime: 'rgb(0, 255, 0)',
      limegreen: 'rgb(50, 205, 50)',
      linen: 'rgb(250, 240, 230)',
      magenta: 'rgb(255, 0, 255)',
      maroon: 'rgb(128, 0, 0)',
      mediumaquamarine: 'rgb(102, 205, 170)',
      mediumblue: 'rgb(0, 0, 205)',
      mediumorchid: 'rgb(186, 85, 211)',
      mediumpurple: 'rgb(147, 112, 219)',
      mediumseagreen: 'rgb(60, 179, 113)',
      mediumslateblue: 'rgb(123, 104, 238)',
      mediumspringgreen: 'rgb(0, 250, 154)',
      mediumturquoise: 'rgb(72, 209, 204)',
      mediumvioletred: 'rgb(199, 21, 133)',
      midnightblue: 'rgb(25, 25, 112)',
      mintcream: 'rgb(245, 255, 250)',
      mistyrose: 'rgb(255, 228, 225)',
      moccasin: 'rgb(255, 228, 181)',
      navajowhite: 'rgb(255, 222, 173)',
      navy: 'rgb(0, 0, 128)',
      oldlace: 'rgb(253, 245, 230)',
      olive: 'rgb(128, 128, 0)',
      olivedrab: 'rgb(107, 142, 35)',
      orange: 'rgb(255, 165, 0)',
      orangered: 'rgb(255, 69, 0)',
      orchid: 'rgb(218, 112, 214)',
      palegoldenrod: 'rgb(238, 232, 170)',
      palegreen: 'rgb(152, 251, 152)',
      paleturquoise: 'rgb(175, 238, 238)',
      palevioletred: 'rgb(219, 112, 147)',
      papayawhip: 'rgb(255, 239, 213)',
      peachpuff: 'rgb(255, 218, 185)',
      peru: 'rgb(205, 133, 63)',
      pink: 'rgb(255, 192, 203)',
      plum: 'rgb(221, 160, 221)',
      powderblue: 'rgb(176, 224, 230)',
      purple: 'rgb(128, 0, 128)',
      rebeccapurple: 'rgb(102, 51, 153)',
      red: 'rgb(255, 0, 0)',
      rosybrown: 'rgb(188, 143, 143)',
      royalblue: 'rgb(65, 105, 225)',
      saddlebrown: 'rgb(139, 69, 19)',
      salmon: 'rgb(250, 128, 114)',
      sandybrown: 'rgb(244, 164, 96)',
      seagreen: 'rgb(46, 139, 87)',
      seashell: 'rgb(255, 245, 238)',
      sienna: 'rgb(160, 82, 45)',
      silver: 'rgb(192, 192, 192)',
      skyblue: 'rgb(135, 206, 235)',
      slateblue: 'rgb(106, 90, 205)',
      slategray: 'rgb(112, 128, 144)',
      slategrey: 'rgb(112, 128, 144)',
      snow: 'rgb(255, 250, 250)',
      springgreen: 'rgb(0, 255, 127)',
      steelblue: 'rgb(70, 130, 180)',
      tan: 'rgb(210, 180, 140)',
      teal: 'rgb(0, 128, 128)',
      thistle: 'rgb(216, 191, 216)',
      tomato: 'rgb(255, 99, 71)',
      turquoise: 'rgb(64, 224, 208)',
      violet: 'rgb(238, 130, 238)',
      wheat: 'rgb(245, 222, 179)',
      white: 'rgb(255, 255, 255)',
      whitesmoke: 'rgb(245, 245, 245)',
      yellow: 'rgb(255, 255, 0)',
      yellowgreen: 'rgb(154, 205, 50)',
    };

    if (Object.prototype.hasOwnProperty.call(color, colorName.toLowerCase())) {
      colorStr = color[colorName];
    }

    return colorStr;
  };

  /**
   * Source https://github.com/luxotus/color-contrast/blob/master/color-contrast.js
   * Turns hex into a float
   *
   * @param {hexadecimal}
   * @returns {float} alpha between 0-1
  */
  const alphaHex = function (hex) {
    return parseFloat(parseInt((parseInt(hex, 10) / 255) * 1000, 10) / 1000);
  };

  /**
   * Source https://github.com/luxotus/color-contrast/blob/master/color-contrast.js
   * Convert hex into a rgb/rgba color value
   *
   * @param {string} hex - this can be in 3 different forms. Ex #000 or #123456 or #123456FF
   * @returns {string} rgb(#, #, #) / rgba(#, #, #, #)
  */
  const hexToRgbA = function (hex) {
    const color = {};

    if (/^#([A-Fa-f0-9]{3}){1,2}$/.test(hex)) { // 3 or 6 digit hex color
      color.rawHex = hex.substring(1).split('');

      if (color.rawHex.length === 3) {
        color.rawHex = [
          color.rawHex[0],
          color.rawHex[0],
          color.rawHex[1],
          color.rawHex[1],
          color.rawHex[2],
          color.rawHex[2],
        ];
      }

      color.rawHex = `0x${color.rawHex.join('')}`; // turning to hex
      color.red = (color.rawHex >> 16) & 255;
      color.green = (color.rawHex >> 8) & 255;
      color.blue = color.rawHex & 255;
      color.message = `rgb(${[color.red, color.green, color.blue].join(', ')})`;
    } else if (/^#([A-Fa-f0-9]{4}){1,2}$/.test(hex)) { // 8 digit hex color
      color.rawHex = hex.substring(1).split('');
      color.rawHex = `0x${color.rawHex.join('')}`;
      color.red = (color.rawHex >> 24) & 255;
      color.green = (color.rawHex >> 16) & 255;
      color.blue = (color.rawHex >> 8) & 255;
      color.alpha = alphaHex(color.rawHex & 255);
      color.message = `rgba(${[color.red, color.green, color.blue].join(', ')}, ${color.alpha})`;
    } else {
      color.message = 'Not a valid hex color code.';
    }

    return color.message;
  };

  /**
   * Turn colors into rgb/rgba value
   *
   * @param {string} color hex, color-name
   * @returns {string} rgb or rgba
   */
  const convertColorToRGB = function (color) {
    let rgb = '';

    if (color.includes('rgb')) {
      rgb = color;
    } else if (color.includes('#')) {
      rgb = hexToRgbA(color);
    } else if (colorNamesToRGB(color) !== '') {
      rgb = colorNamesToRGB(color);
    }

    return rgb;
  };

  /**
   * Grab the color of an element on the page
   * and convert its colors/images into a specified color deficiency.
   *
   * @param {obj} element
   * @param {string} deficiency
   * @returns {string} status message
   */
  const convertElementToDeficiency = function (element, deficiency) {
    if (typeof element !== 'undefined') {
      const currentElement = element;
      const elementColors = {
        color: convertColorToRGB(window.getComputedStyle(currentElement, null).getPropertyValue('color')),
        'border-top-color': convertColorToRGB(window.getComputedStyle(currentElement, null).getPropertyValue('border-top-color')),
        'border-right-color': convertColorToRGB(window.getComputedStyle(currentElement, null).getPropertyValue('border-right-color')),
        'border-left-color': convertColorToRGB(window.getComputedStyle(currentElement, null).getPropertyValue('border-left-color')),
        'border-bottom-color': convertColorToRGB(window.getComputedStyle(currentElement, null).getPropertyValue('border-bottom-color')),
        'background-color': convertColorToRGB(window.getComputedStyle(currentElement, null).getPropertyValue('background-color')),
      };

      if (!domColorUpdated) {
        originalElements.push([currentElement, elementColors]);
      }

      Object.entries(elementColors).forEach(([key, value]) => {
        if (value !== '') {
          currentElement.style[key] = convertColorToDeficiency(value, deficiency);
        }
      });
    }

    return '';
  };

  /**
   * Iterate through the all elements in a dom and pass it to funcition above
   *
   * @param {string} deficiency
   * @returns {string} status message
   */
  const convertDomToDeficiency = function (deficiency) {
    // Grab all elements
    const elements = document.getElementsByTagName('*');

    if (domColorUpdated) {
      for (let index = 0; index < originalElements.length; index += 1) {
        Object.entries(originalElements[index][1]).forEach(([key, value]) => {
          originalElements[index][0].style[key] = convertColorToDeficiency(value, deficiency);
        });
      }
    }

    Object.getOwnPropertyNames(elements).forEach((key) => {
      convertElementToDeficiency(elements[key], deficiency);
    });

    domColorUpdated = true;
    return '';
  };

  /**
   * Setup event listeners on deficiency toggle buttons to loop through deficiencies
   *
   * @param {string} togglePosition
   * @param {boolean} includeStyle
   */
  const initialize = function (togglePosition, includeStyle) {
    const {
      txtId,
      arrowLeftBtn,
      arrowRightBtn,
      style,
      html,
    } = buildColorToggle(true, togglePosition);
    const deficiencyKeys = Object.keys(colorDeficiencies);
    const deficiencyValues = Object.values(colorDeficiencies);
    const lastDeficiency = deficiencyKeys.length - 1;
    let deficiencyIndex = 0;

    if (includeStyle) {
      const styleElement = document.createElement('style');
      styleElement.type = 'text/css';
      styleElement.appendChild(document.createTextNode(style));
      document.getElementsByTagName('head')[0].appendChild(styleElement);
    }

    document.getElementsByTagName('body')[0].innerHTML += html;
    document.getElementById(txtId).innerHTML = deficiencyValues[0];

    document.getElementById(arrowLeftBtn).addEventListener('click', () => {
      if (deficiencyIndex === 0) {
        deficiencyIndex = lastDeficiency;
      } else {
        deficiencyIndex -= 1;
      }

      document.getElementById(txtId).innerHTML = deficiencyValues[deficiencyIndex];
      convertDomToDeficiency(deficiencyValues[deficiencyIndex]);
    });

    document.getElementById(arrowRightBtn).addEventListener('click', () => {
      if (deficiencyIndex === deficiencyKeys.length - 1) {
        deficiencyIndex = 0;
      } else {
        deficiencyIndex += 1;
      }

      document.getElementById(txtId).innerHTML = deficiencyValues[deficiencyIndex];
      convertDomToDeficiency(deficiencyValues[deficiencyIndex]);
    });
  };

  return {
    init: initialize,
    convertColor: convertColorToDeficiency,
    convertElement: convertElementToDeficiency,
    convertDom: convertDomToDeficiency,
    convertRGB: convertColorToRGB,
  };
})();
