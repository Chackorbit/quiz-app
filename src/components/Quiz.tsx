import React, { useState, useEffect } from "react";
import { IQuiz } from "../types/types";

interface QuizProps {
  quiz: IQuiz;
  onEnd: () => void;
}

const Quiz: React.FC<QuizProps> = ({ quiz, onEnd }) => {
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedAnswerIndex, setSelectedAnswerIndex] = useState<number | null>(
    null
  );
  const [score, setScore] = useState(0);
  const [showScore, setShowScore] = useState(false);
  const [timeLeft, setTimeLeft] = useState(quiz.timer ? quiz.timer * 60 : null);
  const [answers, setAnswers] = useState<
    { questionIndex: number; answerIndex: number | null }[]
  >([]);

  useEffect(() => {
    if (timeLeft === null) return;

    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev && prev > 0) {
          return prev - 1;
        } else {
          clearInterval(timer);
          setShowScore(true);
          return 0;
        }
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [timeLeft]);

  const handleAnswerSelect = (index: number) => {
    setSelectedAnswerIndex(index);
  };

  const handleNextQuestion = () => {
    const newAnswers = [
      ...answers,
      { questionIndex: currentQuestionIndex, answerIndex: selectedAnswerIndex },
    ];
    setAnswers(newAnswers);

    if (selectedAnswerIndex !== null) {
      const currentQuestion = quiz.questions[currentQuestionIndex];
      const selectedAnswer = currentQuestion.answers[selectedAnswerIndex];
      if (selectedAnswer.isCorrect) {
        setScore(score + currentQuestion.points);
      }
    }

    setSelectedAnswerIndex(null);
    if (currentQuestionIndex + 1 === quiz.questions.length) {
      setShowScore(true);
    } else {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
    }
  };

  const handleSkipQuestion = () => {
    const newAnswers = [
      ...answers,
      { questionIndex: currentQuestionIndex, answerIndex: null },
    ];
    setAnswers(newAnswers);
    setSelectedAnswerIndex(null);
    if (currentQuestionIndex + 1 === quiz.questions.length) {
      setShowScore(true);
    } else {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
    }
  };

  const handleEndQuiz = () => {
    setShowScore(true);
  };

  const formatTime = (seconds: number) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}:${remainingSeconds < 10 ? "0" : ""}${remainingSeconds}`;
  };

  return (
    <div className="mt-4">
      <h2 className="text-2xl font-bold mb-4">{quiz.name}</h2>
      {timeLeft !== null && (
        <div className="mb-4">
          <span>Time Left: {formatTime(timeLeft)}</span>
        </div>
      )}
      {showScore ? (
        <div>
          <h3 className="text-xl font-bold mb-2">Your Score: {score}</h3>
          {quiz.questions.map((question, index) => {
            const answer = answers.find((a) => a.questionIndex === index);
            const selectedAnswer = answer
              ? question.answers[answer.answerIndex!]
              : null;
            return (
              <div key={question.id} className="mb-4">
                <p className="font-bold">{question.text}</p>
                {question.answers.map((answer, i) => (
                  <div
                    key={answer.id}
                    className={`p-2 ${
                      answer.isCorrect
                        ? "bg-green-200"
                        : selectedAnswer === answer
                        ? "bg-red-200"
                        : ""
                    }`}
                  >
                    {answer.text}{" "}
                    {selectedAnswer === answer && !answer.isCorrect && (
                      <span className="text-red-500">(Incorrect)</span>
                    )}{" "}
                    {answer.isCorrect && selectedAnswer === answer && (
                      <span className="text-green-500">
                        (+{question.points} points)
                      </span>
                    )}
                  </div>
                ))}
                {selectedAnswer && !selectedAnswer.isCorrect && (
                  <p className="text-green-500">
                    Correct Answer:{" "}
                    {question.answers.find((a) => a.isCorrect)?.text}
                  </p>
                )}
              </div>
            );
          })}
          <button
            className="bg-blue-500 text-white px-4 py-2 mt-4"
            onClick={onEnd}
          >
            Close Quiz
          </button>
        </div>
      ) : (
        <div>
          <h3 className="text-xl font-bold mb-2">
            Question {currentQuestionIndex + 1}
          </h3>
          <p className="mb-4">{quiz.questions[currentQuestionIndex]?.text}</p>
          <div>
            {quiz?.questions[currentQuestionIndex]?.answers?.map(
              (answer, index) => (
                <div key={answer?.id} className="mb-2">
                  <input
                    type="radio"
                    id={`answer-${index}`}
                    name={`answer-${currentQuestionIndex}`}
                    checked={selectedAnswerIndex === index}
                    onChange={() => handleAnswerSelect(index)}
                  />
                  <label htmlFor={`answer-${index}`} className="ml-2">
                    {answer?.text}
                  </label>
                </div>
              )
            )}
          </div>
          <button
            className="bg-blue-500 text-white px-4 py-2 mt-4"
            onClick={handleNextQuestion}
          >
            {currentQuestionIndex === quiz?.questions?.length - 1
              ? "End Quiz"
              : "Next Question"}
          </button>
          <button
            className="bg-red-500 text-white px-4 py-2 mt-4 ml-4"
            onClick={handleSkipQuestion}
          >
            Skip Question
          </button>
          <button
            className="bg-blue-500 text-white px-4 py-2 mt-4 ml-4"
            onClick={handleEndQuiz}
          >
            End Quiz
          </button>
        </div>
      )}
    </div>
  );
};

export default Quiz;
