export interface IAnswer {
  id: string;
  text: string;
  isCorrect: boolean;
}

export interface IQuestion {
  id: string;
  text: string;
  points: number;
  answers: IAnswer[];
}

export interface IQuiz {
  id: string;
  name: string;
  description: string;
  questions: IQuestion[];
  timer?: number;
}
