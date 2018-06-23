describe('Color Blindness Tool', () => {

    // init ( showColorToggle, colorTogglePosition, showDebugMessages )
    describe('Initializing color toggle', () => {
        it('', function() {
            expect(colorBlindnessTool.init()).toBe('');
        });
    });

    // getDetails ( colorDeficiency )
    describe('Get details on color deficiency', () => {
        it('', function() {
            expect(colorBlindnessTool.getDetails()).toEqual(jasmine.objectContaining({}));
        });
    });

    // convertColor ( color, deficiency )
    describe('Convert color to how it would be perceived by a color deficiency', () => {
        it('', function() {
            expect(colorBlindnessTool.convertColor()).toBe('');
        });
    });

    // convertImage ( image, deficiency )
    describe('Convert image to how it would be perceived by a color deficiency', () => {
        it('', function() {
            expect(colorBlindnessTool.convertImage()).toBe('');
        });
    });

    // convertElement ( element, deficiency )
    describe('Convert element to how it would be perceived by a color deficiency', () => {
        it('', function() {
            expect(colorBlindnessTool.convertElement()).toBe('');
        });
    });

    // convertDom ( deficiency, includeImages )
    describe('Converts all colors/images on a dom to how it would be perceived by a color deficiency', () => {
        it('', function() {
            expect(colorBlindnessTool.convertDom()).toBe('');
        });
    });
});