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

  /**
   * Convert color to a specified color deficiency and convert it into specified deficiency
   *
   * @param {string} color
   * @param {string} deficiency
   * @returns {string} converted rgb()
   */
  const convertColorToDeficiency = function (color, deficiency) {
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
