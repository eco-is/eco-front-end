import { Category } from './category';

export type Lecture = {
  id: number;
  name: string;
  content: string;
  difficulty: string;
  minRecommendedAge: number;
  maxRecommendedAge: number;
  categories: Category[];
  creatorId: number;
};
