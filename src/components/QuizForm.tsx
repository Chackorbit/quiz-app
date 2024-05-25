import React, { useState, useEffect } from "react";
import { IQuiz, IQuestion } from "../types/types";
import { v4 as uuidv4 } from "uuid";
import QuestionForm from "./QuestionForm";

interface QuizFormProps {
  quiz?: IQuiz | null;
  onSave: (quiz: IQuiz) => void;
  onCancel: () => void;
}

const QuizForm: React.FC<QuizFormProps> = ({ quiz, onSave, onCancel }) => {
  const [name, setName] = useState(quiz?.name || "");
  const [questions, setQuestions] = useState<IQuestion[]>(
    quiz?.questions || []
  );
  const [timer, setTimer] = useState<number | undefined>(
    quiz?.timer || undefined
  );

  useEffect(() => {
    if (quiz) {
      setName(quiz.name);
      setQuestions(quiz.questions);
      setTimer(quiz.timer);
    }
  }, [quiz]);

  const handleAddQuestion = () => {
    setQuestions([
      ...questions,
      { id: uuidv4(), text: "", points: 1, answers: [] },
    ]);
  };

  const handleDeleteQuestion = (index: number) => {
    setQuestions(questions.filter((_, i) => i !== index));
  };

  const handleSave = () => {
    const newQuiz: IQuiz = {
      id: quiz?.id || uuidv4(),
      name,
      questions,
      description: "",
      timer,
    };
    onSave(newQuiz);
    setName("");
    setQuestions([]);
  };

  const handleQuestionChange = (index: number, question: IQuestion) => {
    const newQuestions = [...questions];
    newQuestions[index] = question;
    setQuestions(newQuestions);
  };

  return (
    <div className="mt-4">
      <h2 className="text-2xl font-bold mb-4">
        {quiz ? "Edit Quiz" : "Add New Quiz"}
      </h2>
      <input
        type="text"
        className="border p-2 w-full mb-4"
        placeholder="Quiz Name"
        value={name}
        onChange={(e) => setName(e.target.value)}
      />
      <input
        type="number"
        className="border p-2 w-full mb-4"
        placeholder="Timer (minutes)"
        value={timer ?? ""}
        onChange={(e) =>
          setTimer(e.target.value ? parseInt(e.target.value) : undefined)
        }
      />
      {questions.map((question, index) => (
        <div key={question.id} className="mb-4">
          <QuestionForm
            question={question}
            onChange={(updatedQuestion) =>
              handleQuestionChange(index, updatedQuestion)
            }
          />
          <button
            className="bg-red-500 text-white px-2 py-1 mt-2"
            onClick={() => handleDeleteQuestion(index)}
          >
            Delete Question
          </button>
        </div>
      ))}
      <button
        className="bg-green-500 text-white px-4 py-2 mt-4"
        onClick={handleAddQuestion}
      >
        Add Question
      </button>
      <button
        className="bg-blue-500 text-white px-4 py-2 mt-4 ml-4"
        onClick={handleSave}
      >
        Save Quiz
      </button>
      <button
        className="bg-red-500 text-white px-4 py-2 mt-4 ml-4"
        onClick={onCancel}
      >
        Cancel
      </button>
    </div>
  );
};

export default QuizForm;
