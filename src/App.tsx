import React, { useState, useEffect } from "react";
import QuizList from "./components/QuizList";
import QuizForm from "./components/QuizForm";
import Quiz from "./components/Quiz";
import { IQuiz } from "./types/types";

const App: React.FC = () => {
  const [quizzes, setQuizzes] = useState<IQuiz[]>(() => {
    const savedQuizzes = localStorage.getItem("quizzes");
    return savedQuizzes ? JSON.parse(savedQuizzes) : [];
  });
  const [selectedQuiz, setSelectedQuiz] = useState<IQuiz | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [isTakingQuiz, setIsTakingQuiz] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    localStorage.setItem("quizzes", JSON.stringify(quizzes));
  }, [quizzes]);

  const handleAddQuiz = () => {
    setSelectedQuiz(null);
    setIsEditing(true);
  };

  const handleEditQuiz = (quiz: IQuiz) => {
    setSelectedQuiz(quiz);
    setIsEditing(true);
  };

  const handleSaveQuiz = (quiz: IQuiz) => {
    setQuizzes((prevQuizzes) => {
      const existingQuizIndex = prevQuizzes.findIndex((q) => q.id === quiz.id);
      if (existingQuizIndex !== -1) {
        const updatedQuizzes = [...prevQuizzes];
        updatedQuizzes[existingQuizIndex] = quiz;
        return updatedQuizzes;
      } else {
        return [...prevQuizzes, quiz];
      }
    });
    setIsEditing(false);
  };

  const handleDeleteQuiz = (id: string) => {
    setQuizzes((prevQuizzes) => prevQuizzes.filter((quiz) => quiz.id !== id));
  };

  const handleCancelEdit = () => {
    setIsEditing(false);
  };

  const handleTakeQuiz = (quiz: IQuiz) => {
    setSelectedQuiz(quiz);
    setIsTakingQuiz(true);
  };

  const handleEndQuiz = () => {
    setSelectedQuiz(null);
    setIsTakingQuiz(false);
  };

  const filteredQuizzes = quizzes.filter((quiz) =>
    quiz.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="container mx-auto px-4">
      <h1 className="text-3xl font-bold my-4">Quiz Application</h1>
      <div className="flex justify-between items-center mb-4">
        <button
          className="bg-green-500 text-white px-4 py-2"
          onClick={handleAddQuiz}
        >
          Add New Quiz
        </button>
        <input
          type="text"
          className="border p-2 w-1/4"
          placeholder="Search by name..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>
      {isEditing ? (
        <QuizForm
          quiz={selectedQuiz}
          onSave={handleSaveQuiz}
          onCancel={handleCancelEdit}
        />
      ) : isTakingQuiz && selectedQuiz ? (
        <Quiz quiz={selectedQuiz} onEnd={handleEndQuiz} />
      ) : (
        <QuizList
          quizzes={filteredQuizzes}
          onEdit={handleEditQuiz}
          onDelete={handleDeleteQuiz}
          onTakeQuiz={handleTakeQuiz}
        />
      )}
    </div>
  );
};

export default App;
