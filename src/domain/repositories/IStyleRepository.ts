import { StyleProfile, StyleTypeId } from '../models/StyleTypes';

export interface IStyleRepository {
  getById(typeId: StyleTypeId): StyleProfile;
  getAll(): Record<StyleTypeId, StyleProfile>;
}
