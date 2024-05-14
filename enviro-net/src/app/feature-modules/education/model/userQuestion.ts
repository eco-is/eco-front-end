import { UserAnswer } from './userAnswer';

export type UserQuestion = {
  id?: number;
  orderInLecture: number;
  lectureId: number;
  content: string;
  type: string;
  answers: UserAnswer[];
};
