import React, { useState } from "react";
import { IQuestion, IAnswer } from "../types/types";
import { v4 as uuidv4 } from "uuid";

interface QuestionFormProps {
  question: IQuestion;
  onChange: (question: IQuestion) => void;
}

const QuestionForm: React.FC<QuestionFormProps> = ({ question, onChange }) => {
  const [text, setText] = useState(question.text);
  const [points, setPoints] = useState(question.points);
  const [answers, setAnswers] = useState<IAnswer[]>(question.answers);

  const handleAddAnswer = () => {
    setAnswers([...answers, { id: uuidv4(), text: "", isCorrect: false }]);
  };

  const handleDeleteAnswer = (index: number) => {
    const newAnswers = answers.filter((_, i) => i !== index);
    setAnswers(newAnswers);
    onChange({ ...question, answers: newAnswers });
  };

  const handleAnswerChange = (index: number, answer: IAnswer) => {
    const newAnswers = [...answers];
    newAnswers[index] = answer;
    setAnswers(newAnswers);
    onChange({ ...question, answers: newAnswers });
  };

  const handleCorrectAnswerChange = (index: number) => {
    const newAnswers = answers.map((answer, i) => ({
      ...answer,
      isCorrect: i === index,
    }));
    setAnswers(newAnswers);
    onChange({ ...question, answers: newAnswers });
  };

  return (
    <div className="mb-4">
      <input
        type="text"
        className="border p-2 w-full mb-2"
        placeholder="Question Text"
        value={text}
        onChange={(e) => {
          setText(e.target.value);
          onChange({ ...question, text: e.target.value });
        }}
      />
      <input
        type="number"
        className="border p-2 w-full mb-2"
        placeholder="Points"
        value={points}
        onChange={(e) => {
          setPoints(parseInt(e.target.value));
          onChange({ ...question, points: parseInt(e.target.value) });
        }}
      />
      {answers.map((answer, index) => (
        <div key={answer.id} className="flex items-center mb-2">
          <input
            type="text"
            className="border p-2 flex-1"
            placeholder="Answer Text"
            value={answer.text}
            onChange={(e) =>
              handleAnswerChange(index, { ...answer, text: e.target.value })
            }
          />
          <input
            type="radio"
            className="ml-2"
            checked={answer.isCorrect}
            onChange={() => handleCorrectAnswerChange(index)}
          />
          <button
            className="bg-red-500 text-white px-2 py-1 ml-2"
            onClick={() => handleDeleteAnswer(index)}
          >
            Delete
          </button>
        </div>
      ))}
      <button
        className="bg-green-500 text-white px-2 py-1"
        onClick={handleAddAnswer}
      >
        Add Answer
      </button>
    </div>
  );
};

export default QuestionForm;
