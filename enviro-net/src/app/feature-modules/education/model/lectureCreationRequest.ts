export type LectureCreationRequest = {
  id?: number;
  name: string;
  content: string;
  difficulty: string;
  minRecommendedAge: number;
  maxRecommendedAge: number;
  categories: string[];
  creatorId: number;
};
