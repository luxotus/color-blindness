/* eslint linebreak-style: ["error", "windows"] */
/* eslint wrap-iife: ["error", "any"] */
/* eslint func-names: ["error", "never"] */
/* eslint no-unused-vars: ["error", { "vars": "local" }] */
/* eslint prefer-destructuring: ["error", {VariableDeclarator: {object: true}}] */
/* eslint object-curly-newline: ["error", { "consistent": true }] */
/* eslint-env es6 */
/* eslint no-unused-vars: ["error", { "varsIgnorePattern": "colorBlindnessTool" }] */

const colorBlindnessTool = (function () {
  let debugMode = true;
  const colorDeficiencies = [
    'Red-Weak/Protanomaly',
    'Green-Weak/Deuteranomaly',
    'Blue-Weak/Tritanomaly',
    'Red-Blind/Protanopia',
    'Green-Blind/Deuteranopia',
    'Blue-Blind/Tritanopia',
    'Monochromacy/Achromatopsia',
    'Blue Cone Monochromacy',
  ];

  /**
   * Private function for building toggle using js
   * @returns {string} html with inline css
   */
  const buildColorToggle = function (togglePosition) {
    const randomNum = Math.floor(Math.random() * 1000000);
    const colorToggleHtml = `<div id="def-holder${randomNum}"><div id="button-lt${randomNum}" class="button${randomNum}"><div class="arrow-lt${randomNum}"></div></div><div id="def-txt${randomNum}" class="def${randomNum}">Deficiency</div><div id="button-rt${randomNum}" class="button${randomNum}"><div class="arrow-rt${randomNum}"></div></div></div>`;
    let colorToggleStyle = '';
    let stylePosition = '';

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
      '#def-holder': `display:block;z-index:99999999;height:35px;width:350px;position:absolute;top:0;margin:auto;${stylePosition}border:1px solid #b7b7b7;border-top:none;border-bottom-left-radius:5px;border-bottom-right-radius:5px;background-color:#fff;`,
      '.button': 'position:relative;display:flex;align-items:center;justify-content:center;height:100%;width:25px;float:left;cursor:pointer;',
      '.arrow-lt': 'height:5px;width:5px;border-top:2px solid gray;border-right:2px solid gray;transform:rotate(-135deg);',
      '.arrow-rt': 'height:5px;width:5px;border-top:2px solid gray;border-right:2px solid gray;transform:rotate(45deg);',
      '.def': 'height:100%;width:300px;position:relative;float:left;line-height:35px;font-size:20px;font-weight:bold;text-align:center;constter-spacing:0.5px;',
    };

    Object.entries(selectors).forEach((entry) => {
      colorToggleStyle += `${entry[0]}${randomNum} {${entry[1]}}`;
    });

    return {
      html: colorToggleHtml,
      style: colorToggleStyle,
      arrowLeftBtn: `button-lt${randomNum}`,
      arrowRightBtn: `button-rt${randomNum}`,
      txtId: `def-txt${randomNum}`,
    };
  };

  // const rgb2xyz = function () {
  //   this.x = (0.430574 * this.r + 0.341550 * this.g + 0.178325 * this.b);
  //   this.y = (0.222015 * this.r + 0.706655 * this.g + 0.071330 * this.b);
  //   this.z = (0.020183 * this.r + 0.129553 * this.g + 0.939180 * this.b);

  //   return this;
  // };

  // const xyz2rgb = function () {
  //   this.r = (3.063218 * this.x - 1.393325 * this.y - 0.475802 * this.z);
  //   this.g = (-0.969243 * this.x + 1.875966 * this.y + 0.041555 * this.z);
  //   this.b = (0.067871 * this.x - 0.228834 * this.y + 1.069251 * this.z);

  //   return this;
  // };

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

      if (sumXYZ !== 0) {
        c.u = c.x / sumXYZ;
        c.v = c.y / sumXYZ;
      }

      const getRGBFromXYZ = function (x, y, zc) {
        return {
          r: (3.063218 * x - 1.393325 * y - 0.475802 * zc),
          g: (-0.969243 * x + 1.875966 * y + 0.041555 * zc),
          b: (0.067871 * x - 0.228834 * y + 1.069251 * zc),
        };
      };

      let clm;
      const nx = wx * c.y / wy;
      const nz = wz * c.y / wy;
      const s = {};
      const d = {
        y: 0,
      };

      if (c.u < rBlind[t].cpx) {
        clm = (rBlind[t].cpy - c.v) / (rBlind[t].cpx - c.u);
      } else {
        clm = (c.v - rBlind[t].cpy) / (c.u - rBlind[t].cpx);
      }

      const clyi = c.v - c.u * clm;
      d.u = (rBlind[t].ayi - clyi) / (clm - rBlind[t].am);
      d.v = (clm * d.u) + clyi;

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
      Achromatomaly(v) {
        return anomalize(v, monochrome(v));
      },
    };

    console.table(fBlind.Protanomaly([255, 0, 0]));

    return '';
  };

  /**
   * Convert colors on an image to a specified deficiency
   *
   * @param {obj} image
   * @param {string} deficiency
   * @returns status message
   */
  const convertImageToDeficiency = function (image, deficiency) {
    return '';
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
    return '';
  };

  /**
   * Iterate through the all elements in a dom and pass it to funcition above
   *
   * @param {string} deficiency
   * @param {boolean} includeImages
   * @returns {string} status message
   */
  const convertDomToDeficiency = function (deficiency, includeImages) {
    return '';
  };

  /**
   * Setup event listeners on deficiency toggle buttons to loop through deficiencies
   *
   * @param {string} togglePosition
   * @param {boolean} showDebugMessages
   * @returns {string} status message
   */
  const initialize = function (togglePosition, includeImages, showDebugMessages) {
    const styleElement = document.createElement('style');
    const { txtId, arrowLeftBtn, arrowRightBtn, style, html } = buildColorToggle(togglePosition);
    const lastDeficiency = colorDeficiencies.length - 1;
    let deficiencyIndex = 0;
    let statusMessage = {
      events: {},
    };
    styleElement.type = 'text/css';
    styleElement.appendChild(document.createTextNode(style));
    document.getElementsByTagName('head')[0].appendChild(styleElement);
    document.getElementsByTagName('body')[0].innerHTML += html;
    document.getElementById(txtId).innerHTML = colorDeficiencies[0];

    if (typeof showDebugMessages === 'boolean') {
      debugMode = showDebugMessages;
    }

    document.getElementById(arrowLeftBtn).addEventListener('click', () => {
      if (deficiencyIndex === 0) {
        deficiencyIndex = lastDeficiency;
      } else {
        deficiencyIndex -= 1;
      }

      document.getElementById(txtId).innerHTML = colorDeficiencies[deficiencyIndex];
      // convertDomToDeficiency ( colorDeficiencies[deficiencyIndex], includeImages )
    });

    document.getElementById(arrowRightBtn).addEventListener('click', () => {
      if (deficiencyIndex === colorDeficiencies.length - 1) {
        deficiencyIndex = 0;
      } else {
        deficiencyIndex += 1;
      }

      document.getElementById(txtId).innerHTML = colorDeficiencies[deficiencyIndex];
      // convertDomToDeficiency ( colorDeficiencies[deficiencyIndex], includeImages )
    });

    // Testing
    if (debugMode) {
      document.getElementById(arrowLeftBtn).click();
      if (document.getElementById(txtId).innerHTML === colorDeficiencies[lastDeficiency]) {
        statusMessage.events['left-arrow-btn'] = 'Success';
      } else {
        statusMessage.events['left-arrow-btn'] = 'Fail';
      }

      document.getElementById(arrowRightBtn).click();
      if (document.getElementById(txtId).innerHTML === colorDeficiencies[0]) {
        statusMessage.events['right-arrow-btn'] = 'Success';
      } else {
        statusMessage.events['right-arrow-btn'] = 'Fail';
      }
    } else {
      statusMessage = 'init successful';
    }

    return statusMessage;
  };

  return {
    init: initialize,
    convertColor: convertColorToDeficiency,
    convertImage: convertImageToDeficiency,
    convertElement: convertElementToDeficiency,
    convertDom: convertDomToDeficiency,
  };
})();
