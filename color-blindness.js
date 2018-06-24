var colorBlindnessTool = (function() {
    let debugMode = true;

    /**
     * Private function for building toggle using js
     * @returns {string} html with inline css
     */
    let buildColorToggle = function () {
        let randomNum = Math.floor(Math.random() * 1000000000);
        let colorToggleHtml = '<div id="def-holder'+randomNum+'"><div id="button-lt'+randomNum+'" class="button'+randomNum+'"><div class="arrow-lt'+randomNum+'"></div></div><div id="def-txt'+randomNum+'" class="def'+randomNum+'">Deficiency</div><div id="button-rt'+randomNum+'" class="button'+randomNum+'"><div class="arrow-rt'+randomNum+'"></div></div></div>';
        let colorToggleStyle = '';
        let selectors = {
            id: {
                '#def-holder': 'display:block;z-index:99999999;height:35px;width:350px;position:absolute;top:0;margin:auto;left:0;right:0;border:1px solid #b7b7b7;border-top:none;border-bottom-left-radius:5px;border-bottom-right-radius:5px;background-color:#fff;'
            },
            class: {
                '.button': 'position:relative;display:flex;align-items:center;justify-content:center;height:100%;width:25px;float:left;cursor:pointer;',
                '.arrow-lt': 'height:5px;width:5px;border-top:2px solid gray;border-right:2px solid gray;transform:rotate(-135deg);',
                '.arrow-rt': 'height:5px;width:5px;border-top:2px solid gray;border-right:2px solid gray;transform:rotate(45deg);',
                '.def': 'height:100%;width:300px;position:relative;float:left;line-height:35px;font-size:20px;font-weight:bold;text-align:center;letter-spacing:0.5px;'
            }
        };

        for (const attribute in selectors) {
            for (const key in selectors[attribute]) {
                colorToggleStyle += key+randomNum+' {'+selectors[attribute][key] + '}';
            }
        }

        return {html: colorToggleHtml, style: colorToggleStyle, arrowLeftBtn: 'button-lt'+randomNum, arrowRightBtn: 'button-rt'+randomNum, txtId: 'def-txt'+randomNum};
    };

    /**
     * Get details on a/all color deficiency/deficiencies
     *
     * @param {string} colorDeficiency
     * @returns {{deficiencyName: string, description: string, visibleColors: [string], hiddenColors: [string]}}
     */
    let getColorDeficiencyDetails = function ( colorDeficiency ) {

        return {};
    };

    /**
     * Convert color to a specified color deficiency and convert it into specified deficiency
     *
     * @param {string} color
     * @param {string} deficiency
     * @returns {string} converted rgb()
     */
    let convertColorToDeficiency = function ( color, deficiency ) {

        return '';
    };

    /**
     * Convert colors on an image to a specified deficiency
     *
     * @param {obj} image
     * @param {string} deficiency
     * @returns status message
     */
    let convertImageToDeficiency = function ( image, deficiency ) {

        return '';
    };

    /**
     * Grab the color of an element on the page and convert its colors/images into a specified color deficiency
     *
     * @param {obj} element
     * @param {string} deficiency
     * @returns {string} status message
     */
    let convertElementToDeficiency = function ( element, deficiency ) {

        return '';
    };

    /**
     * Iterate through the all elements in a dom and pass it to funcition above
     *
     * @param {string} deficiency
     * @param {boolean} includeImages
     * @returns {string} status message
     */
    let convertDomToDeficiency = function ( deficiency, includeImages ) {

        return '';
    };

    /**
     * Setup event listeners on deficiency toggle buttons to loop through deficiencies
     *
     * @param {boolean} showColorToggle
     * @param {string} colorTogglePosition
     * @param {boolean} showDebugMessages
     * @returns {string} status message
     */
    let init = function ( showColorToggle, colorTogglePosition, includeImages, showDebugMessages ) {
        let style = document.createElement('style');
        let colorToggle = buildColorToggle();
        let deficiencyIndex = 0;
        let statusMessage = {events:{}};
        let colorDeficiencies = [
            'Red-Weak/Protanomaly',
            'Green-Weak/Deuteranomaly',
            'Blue-Weak/Tritanomaly',
            'Red-Blind/Protanopia',
            'Green-Blind/Deuteranopia',
            'Blue-Blind/Tritanopia',
            'Monochromacy/Achromatopsia',
            'Blue Cone Monochromacy'
        ];
        style.type = 'text/css';
        style.appendChild(document.createTextNode(colorToggle.style));
        document.getElementsByTagName('head')[0].appendChild(style);
        document.getElementsByTagName('body')[0].innerHTML += colorToggle.html;
        document.getElementById(colorToggle.txtId).innerHTML = colorDeficiencies[0];

        if (typeof showDebugMessages == 'boolean') {
            debugMode = showDebugMessages;
        }

        document.getElementById(colorToggle.arrowLeftBtn).addEventListener("click", function() {
            if (deficiencyIndex == 0) {
                deficiencyIndex = colorDeficiencies.length - 1;
            } else {
                deficiencyIndex--;
            }

            document.getElementById(colorToggle.txtId).innerHTML = colorDeficiencies[deficiencyIndex];
            // convertDomToDeficiency ( colorDeficiencies[deficiencyIndex], includeImages )
        });

        document.getElementById(colorToggle.arrowRightBtn).addEventListener("click", function() {
            if (deficiencyIndex == colorDeficiencies.length - 1) {
                deficiencyIndex = 0;
            } else {
                deficiencyIndex++;
            }

            document.getElementById(colorToggle.txtId).innerHTML = colorDeficiencies[deficiencyIndex];
            // convertDomToDeficiency ( colorDeficiencies[deficiencyIndex], includeImages )
        });

        // Testing
        if (debugMode) {
            document.getElementById(colorToggle.arrowLeftBtn).click();
            if (document.getElementById(colorToggle.txtId).innerHTML == colorDeficiencies[colorDeficiencies.length - 1]) {
                statusMessage.events['left-arrow-btn'] = 'Success';
            } else {
                statusMessage.events['left-arrow-btn'] = 'Fail';
            }

            document.getElementById(colorToggle.arrowRightBtn).click();
            if (document.getElementById(colorToggle.txtId).innerHTML == colorDeficiencies[0]) {
                statusMessage.events['right-arrow-btn'] = 'Success';
            } else {
                statusMessage.events['right-arrow-btn'] = 'Fail';
            }

            return statusMessage;
        }
    };

    return {
        init: init,
        getDetails: getColorDeficiencyDetails,
        convertColor: convertColorToDeficiency,
        convertImage: convertImageToDeficiency,
        convertElement: convertElementToDeficiency,
        convertDom: convertDomToDeficiency
    }
})();