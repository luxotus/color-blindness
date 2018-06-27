/* eslint linebreak-style: ["error", "windows"] */
/* global colorBlindnessTool:true */

describe('Color Blindness Tool', () => {
  // init (colorTogglePosition, includeImages, showDebugMessages )
  describe('Initializing color toggle', () => {
    it('Events Listeners on color toggle buttons are working.', () => {
      expect(colorBlindnessTool.init('center', false, false, true)).toEqual(jasmine.objectContaining(
        {
          events: {
            'left-arrow-btn': 'Success',
            'right-arrow-btn': 'Success',
          },
        },
      ));
    });
  });

  describe('Convert color to how it would be perceived by a color deficiency', () => {
    describe('rgb', () => {
      describe('Normal', () => {
        it('Red', () => {
          expect(colorBlindnessTool.convertColor('rgb(255, 0, 0)', 'Normal')).toBe('rgb(255, 0, 0)');
        });
        it('Green', () => {
          expect(colorBlindnessTool.convertColor('rgb(0, 255, 0)', 'Normal')).toBe('rgb(0, 255, 0)');
        });
        it('Blue', () => {
          expect(colorBlindnessTool.convertColor('rgb(0, 0, 255)', 'Normal')).toBe('rgb(0, 0, 255)');
        });
      });
      describe('Protanopia', () => {
        it('Red', () => {
          expect(colorBlindnessTool.convertColor('rgb(255, 0, 0)', 'Protanopia')).toBe('rgb(145, 129, 26)');
        });
        it('Green', () => {
          expect(colorBlindnessTool.convertColor('rgb(0, 255, 0)', 'Protanopia')).toBe('rgb(246, 218, 0)');
        });
        it('Blue', () => {
          expect(colorBlindnessTool.convertColor('rgb(0, 0, 255)', 'Protanopia')).toBe('rgb(0, 74, 156)');
        });
      });
      describe('Protanomaly', () => {
        it('Red', () => {
          expect(colorBlindnessTool.convertColor('rgb(255, 0, 0)', 'Protanomaly')).toBe('rgb(185, 82, 17)');
        });
        it('Green', () => {
          expect(colorBlindnessTool.convertColor('rgb(0, 255, 0)', 'Protanomaly')).toBe('rgb(156, 232, 0)');
        });
        it('Blue', () => {
          expect(colorBlindnessTool.convertColor('rgb(0, 0, 255)', 'Protanomaly')).toBe('rgb(0, 47, 192)');
        });
      });
      describe('Deuteranopia', () => {
        it('Red', () => {
          expect(colorBlindnessTool.convertColor('rgb(255, 0, 0)', 'Deuteranopia')).toBe('rgb(162, 122, 0)');
        });
        it('Green', () => {
          expect(colorBlindnessTool.convertColor('rgb(0, 255, 0)', 'Deuteranopia')).toBe('rgb(255, 211, 143)');
        });
        it('Blue', () => {
          expect(colorBlindnessTool.convertColor('rgb(0, 0, 255)', 'Deuteranopia')).toBe('rgb(0, 80, 132)');
        });
      });
      describe('Deuteranomaly', () => {
        it('Red', () => {
          expect(colorBlindnessTool.convertColor('rgb(255, 0, 0)', 'Deuteranomaly')).toBe('rgb(196, 78, 0)');
        });
        it('Green', () => {
          expect(colorBlindnessTool.convertColor('rgb(0, 255, 0)', 'Deuteranomaly')).toBe('rgb(162, 227, 91)');
        });
        it('Blue', () => {
          expect(colorBlindnessTool.convertColor('rgb(0, 0, 255)', 'Deuteranomaly')).toBe('rgb(0, 51, 177)');
        });
      });
      describe('Tritanopia', () => {
        it('Red', () => {
          expect(colorBlindnessTool.convertColor('rgb(255, 0, 0)', 'Tritanopia')).toBe('rgb(253, 24, 0)');
        });
        it('Green', () => {
          expect(colorBlindnessTool.convertColor('rgb(0, 255, 0)', 'Tritanopia')).toBe('rgb(115, 236, 255)');
        });
        it('Blue', () => {
          expect(colorBlindnessTool.convertColor('rgb(0, 0, 255)', 'Tritanopia')).toBe('rgb(0, 86, 89)');
        });
      });
      describe('Tritanomaly', () => {
        it('Red', () => {
          expect(colorBlindnessTool.convertColor('rgb(255, 0, 0)', 'Tritanomaly')).toBe('rgb(254, 15, 0)');
        });
        it('Green', () => {
          expect(colorBlindnessTool.convertColor('rgb(0, 255, 0)', 'Tritanomaly')).toBe('rgb(73, 243, 162)');
        });
        it('Blue', () => {
          expect(colorBlindnessTool.convertColor('rgb(0, 0, 255)', 'Tritanomaly')).toBe('rgb(0, 55, 150)');
        });
      });
      describe('Achromatopsia', () => {
        it('Red', () => {
          expect(colorBlindnessTool.convertColor('rgb(255, 0, 0)', 'Achromatopsia')).toBe('rgb(76, 76, 76)');
        });
        it('Green', () => {
          expect(colorBlindnessTool.convertColor('rgb(0, 255, 0)', 'Achromatopsia')).toBe('rgb(150, 150, 150)');
        });
        it('Blue', () => {
          expect(colorBlindnessTool.convertColor('rgb(0, 0, 255)', 'Achromatopsia')).toBe('rgb(29, 29, 29)');
        });
      });
      describe('Achromatomaly', () => {
        it('Red', () => {
          expect(colorBlindnessTool.convertColor('rgb(255, 0, 0)', 'Achromatomaly')).toBe('rgb(141, 48, 48)');
        });
        it('Green', () => {
          expect(colorBlindnessTool.convertColor('rgb(0, 255, 0)', 'Achromatomaly')).toBe('rgb(95, 188, 95)');
        });
        it('Blue', () => {
          expect(colorBlindnessTool.convertColor('rgb(0, 0, 255)', 'Achromatomaly')).toBe('rgb(18, 18, 111)');
        });
      });
    });
    describe('rgba', () => {
      describe('Normal', () => {
        it('Red', () => {
          expect(colorBlindnessTool.convertColor('rgba(255, 0, 0, 0.75)', 'Normal')).toBe('rgba(255, 0, 0, 0.75)');
        });
        it('Green', () => {
          expect(colorBlindnessTool.convertColor('rgba(0, 255, 0, 0.34)', 'Normal')).toBe('rgba(0, 255, 0, 0.34)');
        });
        it('Blue', () => {
          expect(colorBlindnessTool.convertColor('rgba(0, 0, 255, 0.11)', 'Normal')).toBe('rgba(0, 0, 255, 0.11)');
        });
      });
      describe('Protanopia', () => {
        it('Red', () => {
          expect(colorBlindnessTool.convertColor('rgba(255, 0, 0, 0.34)', 'Protanopia')).toBe('rgba(145, 129, 26, 0.34)');
        });
        it('Green', () => {
          expect(colorBlindnessTool.convertColor('rgba(0, 255, 0, 0.4)', 'Protanopia')).toBe('rgba(246, 218, 0, 0.4)');
        });
        it('Blue', () => {
          expect(colorBlindnessTool.convertColor('rgba(0, 0, 255, 0.31)', 'Protanopia')).toBe('rgba(0, 74, 156, 0.31)');
        });
      });
      describe('Protanomaly', () => {
        it('Red', () => {
          expect(colorBlindnessTool.convertColor('rgba(255, 0, 0, 0.921)', 'Protanomaly')).toBe('rgba(185, 82, 17, 0.921)');
        });
        it('Green', () => {
          expect(colorBlindnessTool.convertColor('rgba(0, 255, 0, 0.78)', 'Protanomaly')).toBe('rgba(156, 232, 0, 0.78)');
        });
        it('Blue', () => {
          expect(colorBlindnessTool.convertColor('rgba(0, 0, 255, 0.21)', 'Protanomaly')).toBe('rgba(0, 47, 192, 0.21)');
        });
      });
    });
  });

  // convertElement ( element, deficiency )
  describe('Convert element to how it would be perceived by a color deficiency', () => {
    it('', () => {
      expect(colorBlindnessTool.convertElement()).toBe('');
    });
  });

  // convertRGB ( color )
  describe('Convert a hex or color-name into a rgb/rgba', () => {
    describe('Hex', () => {
      it('#ede', () => {
        expect(colorBlindnessTool.convertRGB('#ede')).toBe('rgb(238, 221, 238)');
      });
      it('#FF12D9', () => {
        expect(colorBlindnessTool.convertRGB('#FF12D9')).toBe('rgb(255, 18, 217)');
      });
      it('#7F5A11D7', () => {
        expect(colorBlindnessTool.convertRGB('#7F5A11D7')).toBe('rgba(127, 90, 17, 0.843)');
      });
    });
    describe('Color Name', () => {
      it('red', () => {
        expect(colorBlindnessTool.convertRGB('red')).toBe('rgb(255, 0, 0)');
      });
      it('Gold', () => {
        expect(colorBlindnessTool.convertRGB('gold')).toBe('rgb(255, 215, 0)');
      });
    });
    describe('RGB/RGBA', () => {
      it('rgb(134, 43, 187)', () => {
        expect(colorBlindnessTool.convertRGB('rgb(134, 43, 187)')).toBe('rgb(134, 43, 187)');
      });
      it('rgba(255, 78, 255, 0.75)', () => {
        expect(colorBlindnessTool.convertRGB('rgba(255, 78, 255, 0.75)')).toBe('rgba(255, 78, 255, 0.75)');
      });
    });
  });

  // convertDom ( deficiency, includeImages )
  describe('Converts all colors/images on a dom to how it would be perceived by a color deficiency', () => {
    it('', () => {
      expect(colorBlindnessTool.convertDom()).toBe('');
    });
  });
});
