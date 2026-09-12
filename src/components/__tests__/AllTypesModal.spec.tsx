import { describe, it, expect } from 'vitest';
import React from 'react';
import { renderToString } from 'react-dom/server';
import { AllTypesModal } from '../AllTypesModal';
import { PRESET_STYLES } from '../../infrastructure/repositories/presetStyles';
import { StyleTypeId } from '../../domain/models/StyleTypes';

describe('AllTypesModal Component Rendering Test', () => {
  it('renders without throwing when isOpen is true', () => {
    expect(() => {
      const html = renderToString(
        <AllTypesModal
          isOpen={true}
          onClose={() => {}}
          allStyles={PRESET_STYLES}
          currentTypeId={StyleTypeId.POP_SPORTY}
          onSelectType={() => {}}
        />
      );
      expect(html).toContain('スタイル大図鑑');
    }).not.toThrow();
  });
});
