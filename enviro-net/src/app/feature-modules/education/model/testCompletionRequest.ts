import { SubmittedAnswer } from './submittedAnswer';

export type TestCompletionRequest = {
  lectureId: number;
  answers: SubmittedAnswer[];
};
