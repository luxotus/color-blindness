/* eslint linebreak-style: ["error", "windows"] */
/* global colorBlindnessTool:true */

describe('Color Blindness Tool', () => {
  // init (colorTogglePosition, includeImages, showDebugMessages )
  describe('Initializing color toggle', () => {
    it('Events Listeners on color toggle buttons are working.', () => {
      expect(colorBlindnessTool.init('center', false, true)).toEqual(jasmine.objectContaining(
        {
          events: {
            'left-arrow-btn': 'Success',
            'right-arrow-btn': 'Success',
          },
        },
      ));
    });
  });

  // convertColor ( color, deficiency )
  describe('Convert color to how it would be perceived by a color deficiency', () => {
    it('', () => {
      expect(colorBlindnessTool.convertColor('rgb(255, 0, 0)')).toBe('rgb(185, 82, 17)');
    });
  });

  // convertImage ( image, deficiency )
  describe('Convert image to how it would be perceived by a color deficiency', () => {
    it('', () => {
      expect(colorBlindnessTool.convertImage()).toBe('');
    });
  });

  // convertElement ( element, deficiency )
  describe('Convert element to how it would be perceived by a color deficiency', () => {
    it('', () => {
      expect(colorBlindnessTool.convertElement()).toBe('');
    });
  });

  // convertDom ( deficiency, includeImages )
  describe('Converts all colors/images on a dom to how it would be perceived by a color deficiency', () => {
    it('', () => {
      expect(colorBlindnessTool.convertDom()).toBe('');
    });
  });
});
