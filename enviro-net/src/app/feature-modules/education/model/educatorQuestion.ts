import { EducatorAnswer } from './educatorAnswer';

export type EducatorQuestion = {
  id?: number;
  orderInLecture: number;
  lectureId: number;
  content: string;
  type: string;
  answers: EducatorAnswer[];
};
