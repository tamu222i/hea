import { IStyleRepository } from '../../domain/repositories/IStyleRepository';
import { StyleProfile, StyleTypeId } from '../../domain/models/StyleTypes';
import { PRESET_STYLES } from './presetStyles';

export class PresetStyleRepository implements IStyleRepository {
  public getById(typeId: StyleTypeId): StyleProfile {
    const style = PRESET_STYLES[typeId];
    if (!style) {
      throw new Error(`StyleProfile not found for typeId: ${typeId}`);
    }
    return { ...style };
  }

  public getAll(): Record<StyleTypeId, StyleProfile> {
    return { ...PRESET_STYLES };
  }
}
