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

  const rgb2xyz = function () {
    this.x = (0.430574 * this.r + 0.341550 * this.g + 0.178325 * this.b);
    this.y = (0.222015 * this.r + 0.706655 * this.g + 0.071330 * this.b);
    this.z = (0.020183 * this.r + 0.129553 * this.g + 0.939180 * this.b);

    return this;
  };

  const xyz2rgb = function () {
    this.r = (3.063218 * this.x - 1.393325 * this.y - 0.475802 * this.z);
    this.g = (-0.969243 * this.x + 1.875966 * this.y + 0.041555 * this.z);
    this.b = (0.067871 * this.x - 0.228834 * this.y + 1.069251 * this.z);

    return this;
  };

  const anomylize = function (a, b) {
    const v = 1.75;
    const d = v * 1 + 1;

    return [
      (v * b[0] + a[0] * 1) / d,
      (v * b[1] + a[1] * 1) / d,
      (v * b[2] + a[2] * 1) / d,
    ];
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

      function Color() {
        this.rgb_from_xyz = xyz2rgb;
        this.xyz_from_rgb = rgb2xyz;
      }

      const blue = r[2];
      const green = r[1];
      const red = r[0];
      const c = new Color();

      c.r = (red / 255) ** gamma;
      c.g = (green / 255) ** gamma;
      c.b = (blue / 255) ** gamma;
      c.xyz_from_rgb();

      const sumXYZ = c.x + c.y + c.z;
      c.u = 0;
      c.v = 0;

      if (sumXYZ !== 0) {
        c.u = c.x / sumXYZ;
        c.v = c.y / sumXYZ;
      }

      const nx = wx * c.y / wy;
      const nz = wz * c.y / wy;
      let clm;
      const s = new Color();
      const d = new Color();
      d.y = 0;

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
      s.rgb_from_xyz();

      d.x = nx - s.x;
      d.z = nz - s.z;
      d.rgb_from_xyz();

      const adjr = d.r ? ((s.r < 0 ? 0 : 1) - s.r) / d.r : 0;
      const adjg = d.g ? ((s.g < 0 ? 0 : 1) - s.g) / d.g : 0;
      const adjb = d.b ? ((s.b < 0 ? 0 : 1) - s.b) / d.b : 0;

      const adjust = Math.max(((adjr > 1 || adjr < 0) ? 0 : adjr),
        ((adjg > 1 || adjg < 0) ? 0 : adjg), ((adjb > 1 || adjb < 0) ? 0 : adjb));

      s.r += (adjust * d.r);
      s.g += (adjust * d.g);
      s.b += (adjust * d.b);

      function z(v) {
        let total = 0;

        if (v > 0) {
          total = v >= 1 ? 1 : v ** (1 / gamma);
        }

        return 255 * total;
      }

      return [
        z(s.r),
        z(s.g),
        z(s.b),
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
        return anomylize(v, blindMK(v, 'protan'));
      },
      Deuteranopia(v) {
        return blindMK(v, 'deutan');
      },
      Deuteranomaly(v) {
        return anomylize(v, blindMK(v, 'deutan'));
      },
      Tritanopia(v) {
        return blindMK(v, 'tritan');
      },
      Tritanomaly(v) {
        return anomylize(v, blindMK(v, 'tritan'));
      },
      Achromatopsia(v) {
        return monochrome(v);
      },
      Achromatomaly(v) {
        return anomylize(v, monochrome(v));
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
