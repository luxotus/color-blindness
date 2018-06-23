var colorBlindnessTool = (function() {
    let debugMode = true;

    /**
     * Setup event listeners on deficiency toggle buttons to loop through deficiencies
     *
     * @param {boolean} showColorToggle
     * @param {string} colorTogglePosition
     * @param {boolean} showDebugMessages
     * @returns {string} status message
     */
    let init = function ( showColorToggle, colorTogglePosition, showDebugMessages ) {
        if (typeof showDebugMessages == 'boolean') {
            debugMode = showDebugMessages;
        }

        return '';
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

    return {
        init: init,
        getDetails: getColorDeficiencyDetails,
        convertColor: convertColorToDeficiency,
        convertImage: convertImageToDeficiency,
        convertElement: convertElementToDeficiency,
        convertDom: convertDomToDeficiency
    }
})();