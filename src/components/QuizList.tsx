import React from "react";
import { IQuiz } from "../types/types";

interface QuizListProps {
  quizzes: IQuiz[];
  onEdit: (quiz: IQuiz) => void;
  onDelete: (id: string) => void;
  onTakeQuiz: (quiz: IQuiz) => void;
}

const QuizList: React.FC<QuizListProps> = ({
  quizzes,
  onEdit,
  onDelete,
  onTakeQuiz,
}) => {
  return (
    <div>
      {quizzes.map((quiz) => (
        <div key={quiz.id} className="border p-4 mb-4">
          <h2 className="text-xl font-bold">{quiz.name}</h2>
          <p>{quiz.description}</p>
          <button
            className="bg-blue-500 text-white px-4 py-2 mt-2"
            onClick={() => onEdit(quiz)}
          >
            Edit
          </button>
          <button
            className="bg-red-500 text-white px-4 py-2 mt-2 ml-2"
            onClick={() => onDelete(quiz.id)}
          >
            Delete
          </button>
          <button
            className="bg-green-500 text-white px-4 py-2 mt-2 ml-2"
            onClick={() => onTakeQuiz(quiz)}
          >
            Take Quiz
          </button>
        </div>
      ))}
    </div>
  );
};

export default QuizList;
