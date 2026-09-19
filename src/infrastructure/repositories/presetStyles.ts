import { StyleProfile } from '../../domain/models/StyleTypes';
import { buildStyleProfile } from '../data/styleBuilder';
import { buildFromCompactStyle } from '../data/styleBuilder';
import { STYLES_BATCH_1 } from '../data/stylesBatch1';
import { STYLES_BATCH_2 } from '../data/stylesBatch2';
import { STYLES_BATCH_3 } from '../data/stylesBatch3';
import { SECRETS_GIRLY_20 } from '../data/secretsGirly20';
import { SECRETS_POP_20 } from '../data/secretsPop20';
import { SECRETS_COOL_20 } from '../data/secretsCool20';
import { SECRETS_NATURAL_20 } from '../data/secretsNatural20';
import { SECRETS_KIMETSU_20 } from '../data/secretsKimetsu20';

// 1. Build all style profiles (205 total: 105 base + 100 new secret styles)
const batch1Profiles: StyleProfile[] = STYLES_BATCH_1.map(buildStyleProfile);
const batch2Profiles: StyleProfile[] = STYLES_BATCH_2.map(buildFromCompactStyle);
const batch3Profiles: StyleProfile[] = STYLES_BATCH_3.map(buildFromCompactStyle);
const secretsGirlyProfiles: StyleProfile[] = SECRETS_GIRLY_20.map(buildFromCompactStyle);
const secretsPopProfiles: StyleProfile[] = SECRETS_POP_20.map(buildFromCompactStyle);
const secretsCoolProfiles: StyleProfile[] = SECRETS_COOL_20.map(buildFromCompactStyle);
const secretsNaturalProfiles: StyleProfile[] = SECRETS_NATURAL_20.map(buildFromCompactStyle);
const secretsKimetsuProfiles: StyleProfile[] = SECRETS_KIMETSU_20.map(buildFromCompactStyle);

export const ALL_STYLE_PROFILES: StyleProfile[] = [
  ...batch1Profiles,
  ...batch2Profiles,
  ...batch3Profiles,
  ...secretsGirlyProfiles,
  ...secretsPopProfiles,
  ...secretsCoolProfiles,
  ...secretsNaturalProfiles,
  ...secretsKimetsuProfiles,
];

// 2. Map for quick ID-based lookup
export const PRESET_STYLES: Record<string, StyleProfile> = ALL_STYLE_PROFILES.reduce(
  (acc, profile) => {
    acc[profile.typeId] = profile;
    return acc;
  },
  {} as Record<string, StyleProfile>
);

// 3. Helper accessors
export function getStyleById(id: string): StyleProfile {
  return PRESET_STYLES[id] || PRESET_STYLES['pop_sporty'];
}

export function getAllStyles(): StyleProfile[] {
  return ALL_STYLE_PROFILES;
}

export function getSecretStyles(): StyleProfile[] {
  return ALL_STYLE_PROFILES.filter((s) => s.isSecret);
}

export function getStandardStyles(): StyleProfile[] {
  return ALL_STYLE_PROFILES.filter((s) => !s.isSecret);
}
