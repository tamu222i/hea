import { z } from 'zod';

export const UserAnswersSchema = z.object({
  favoriteColor: z.string().min(1, '好きな色を選択してください'),
  favoriteFood: z.string().min(1, '好きな食べ物を選択してください'),
  weekendActivity: z.string().min(1, '休日の過ごし方を選択してください'),
  currentMood: z.string().min(1, '今の気分を選択してください'),
  hairLength: z.enum(['short', 'medium', 'long'], {
    message: '髪の長さを選んでください',
  }),
});

export type UserAnswers = z.infer<typeof UserAnswersSchema>;
