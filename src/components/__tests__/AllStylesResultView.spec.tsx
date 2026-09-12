import { describe, it, expect } from 'vitest';
import React from 'react';
import { renderToString } from 'react-dom/server';
import { PRESET_STYLES } from '../../infrastructure/repositories/presetStyles';
import { ResultHeader } from '../ResultHeader';
import { ColorPaletteView } from '../ColorPaletteView';
import { HairArrangementCard } from '../HairArrangementCard';
import { FashionCoordCard } from '../FashionCoordCard';
import { AiStylistConsultant } from '../AiStylistConsultant';

describe('Feature: All 105 styles render without runtime errors in Result view', () => {
  const styles = Object.values(PRESET_STYLES);

  it('has 105 styles in PRESET_STYLES', () => {
    expect(styles.length).toBe(105);
  });

  styles.forEach((profile) => {
    it(`renders Result view for style "${profile.typeName}" (${profile.typeId})`, () => {
      expect(() => {
        renderToString(
          <div>
            <ResultHeader profile={profile} />
            <ColorPaletteView colors={profile.recommendedColors} />
            <HairArrangementCard hairStyles={profile.hairStyles} userLength="medium" />
            <FashionCoordCard
              schoolFashion={profile.schoolFashion}
              weekendFashion={profile.weekendFashion}
            />
            <AiStylistConsultant profile={profile} hairLength="medium" />
          </div>
        );
      }).not.toThrow();
    });
  });
});
