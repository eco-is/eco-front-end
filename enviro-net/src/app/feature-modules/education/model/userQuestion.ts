import { UserAnswer } from './userAnswer';

export type UserQuestion = {
  id?: number;
  orderInLecture: number;
  lectureId: number;
  content: string;
  type: 'RADIO' | 'CHECKBOX' | 'FILL_IN';
  answers: UserAnswer[];
};
