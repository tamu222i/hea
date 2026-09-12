import { StyleProfile, StyleTypeId } from '../models/StyleTypes';
import { UserAnswers } from '../schemas/diagnosisSchema';
import { IStyleRepository } from '../repositories/IStyleRepository';
import { PresetStyleRepository } from '../../infrastructure/repositories/PresetStyleRepository';

export class DiagnosisDomainService {
  constructor(private readonly styleRepo: IStyleRepository = new PresetStyleRepository()) {}

  /**
   * ユーザーの回答に基づいてスコアを集計し、最適なスタイルプロファイルを判定する
   */
  public diagnose(answers: UserAnswers): StyleProfile {
    const scores = this.calculateScores(answers);
    const selectedTypeId = this.determineDominantType(scores);
    const baseProfile = this.styleRepo.getById(selectedTypeId);

    return {
      ...baseProfile,
      hairStyles: this.prioritizeHairStyles(baseProfile.hairStyles, answers.hairLength),
    };
  }

  private calculateScores(answers: UserAnswers): Record<StyleTypeId, number> {
    const scores: Record<StyleTypeId, number> = {
      [StyleTypeId.POP_SPORTY]: 0,
      [StyleTypeId.SWEET_GIRLY]: 0,
      [StyleTypeId.COOL_CASUAL]: 0,
      [StyleTypeId.NATURAL_PURE]: 0,
      [StyleTypeId.TRENDY_IDOL]: 0,
    };

    // 1. 好きな色によるスコア配分
    this.addScore(scores, this.getColorWeights(answers.favoriteColor));

    // 2. 好きな食べ物によるスコア配分
    this.addScore(scores, this.getFoodWeights(answers.favoriteFood));

    // 3. 休日の過ごし方によるスコア配分
    this.addScore(scores, this.getActivityWeights(answers.weekendActivity));

    // 4. 気分によるスコア配分
    this.addScore(scores, this.getMoodWeights(answers.currentMood));

    return scores;
  }

  private addScore(target: Record<StyleTypeId, number>, weights: Partial<Record<StyleTypeId, number>>) {
    for (const [key, value] of Object.entries(weights) as [StyleTypeId, number][]) {
      target[key] += value ?? 0;
    }
  }

  private getColorWeights(color: string): Partial<Record<StyleTypeId, number>> {
    switch (color) {
      case 'yellow':
      case 'orange':
        return { [StyleTypeId.POP_SPORTY]: 3, [StyleTypeId.NATURAL_PURE]: 1 };
      case 'pink':
      case 'lavender':
        return { [StyleTypeId.SWEET_GIRLY]: 3, [StyleTypeId.TRENDY_IDOL]: 1 };
      case 'blue':
      case 'black':
        return { [StyleTypeId.COOL_CASUAL]: 3, [StyleTypeId.POP_SPORTY]: 1 };
      case 'green':
      case 'beige':
        return { [StyleTypeId.NATURAL_PURE]: 3, [StyleTypeId.COOL_CASUAL]: 1 };
      case 'purple':
      case 'silver':
      case 'rainbow':
        return { [StyleTypeId.TRENDY_IDOL]: 3, [StyleTypeId.SWEET_GIRLY]: 1 };
      default:
        return { [StyleTypeId.POP_SPORTY]: 1 };
    }
  }

  private getFoodWeights(food: string): Partial<Record<StyleTypeId, number>> {
    switch (food) {
      case 'burger_potato':
      case 'curry':
      case 'meat':
        return { [StyleTypeId.POP_SPORTY]: 2, [StyleTypeId.COOL_CASUAL]: 1 };
      case 'sweets_parfait':
      case 'pancake':
      case 'cake':
        return { [StyleTypeId.SWEET_GIRLY]: 2, [StyleTypeId.TRENDY_IDOL]: 1 };
      case 'pizza':
      case 'sandwich':
      case 'ramen':
        return { [StyleTypeId.COOL_CASUAL]: 2, [StyleTypeId.POP_SPORTY]: 1 };
      case 'soup_onigiri':
      case 'bread':
      case 'fruits':
        return { [StyleTypeId.NATURAL_PURE]: 2, [StyleTypeId.SWEET_GIRLY]: 1 };
      case 'macaron_tapioca':
      case 'crepe':
        return { [StyleTypeId.TRENDY_IDOL]: 2, [StyleTypeId.SWEET_GIRLY]: 1 };
      default:
        return {};
    }
  }

  private getActivityWeights(activity: string): Partial<Record<StyleTypeId, number>> {
    switch (activity) {
      case 'active_sports':
      case 'park_bicycle':
        return { [StyleTypeId.POP_SPORTY]: 3 };
      case 'craft_reading':
      case 'cafe_shopping_sweet':
        return { [StyleTypeId.SWEET_GIRLY]: 3 };
      case 'game_youtube':
        return { [StyleTypeId.COOL_CASUAL]: 2, [StyleTypeId.POP_SPORTY]: 1 };
      case 'city_shopping':
        return { [StyleTypeId.COOL_CASUAL]: 2, [StyleTypeId.TRENDY_IDOL]: 2 };
      case 'nature_walk':
      case 'library_museum':
        return { [StyleTypeId.NATURAL_PURE]: 3 };
      case 'dance_tiktok':
      case 'fashion_photo':
        return { [StyleTypeId.TRENDY_IDOL]: 3 };
      default:
        return {};
    }
  }

  private getMoodWeights(mood: string): Partial<Record<StyleTypeId, number>> {
    switch (mood) {
      case 'energetic':
        return { [StyleTypeId.POP_SPORTY]: 2 };
      case 'dreamy':
        return { [StyleTypeId.SWEET_GIRLY]: 2 };
      case 'cool_calm':
        return { [StyleTypeId.COOL_CASUAL]: 2 };
      case 'relax_gentle':
        return { [StyleTypeId.NATURAL_PURE]: 2 };
      case 'sparkle_excited':
        return { [StyleTypeId.TRENDY_IDOL]: 2 };
      default:
        return {};
    }
  }

  private determineDominantType(scores: Record<StyleTypeId, number>): StyleTypeId {
    let highestType: StyleTypeId = StyleTypeId.POP_SPORTY;
    let highestScore = -1;

    for (const [typeKey, score] of Object.entries(scores) as [StyleTypeId, number][]) {
      if (score > highestScore) {
        highestScore = score;
        highestType = typeKey;
      }
    }

    return highestType;
  }

  private prioritizeHairStyles(hairStyles: StyleProfile['hairStyles'], length: 'short' | 'medium' | 'long') {
    return [...hairStyles].sort((a, b) => {
      const aMatches = a.suitableLengths.includes(length);
      const bMatches = b.suitableLengths.includes(length);
      if (aMatches && !bMatches) return -1;
      if (!aMatches && bMatches) return 1;
      return 0;
    });
  }
}
