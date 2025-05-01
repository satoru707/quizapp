import React from "react";
import { useStudy } from "../contexts/StudyContext";

const QuestionTypeSelector: React.FC = () => {
  const {
    questionType,
    setQuestionType,
    numObjectiveQuestions,
    setNumObjectiveQuestions,
    numTheoryQuestions,
    setNumTheoryQuestions,
  } = useStudy();

  return (
    <div className="space-y-6">
      <div>
        <label className="block text-sm font-medium mb-2">Question Type</label>
        <div className="grid grid-cols-3 gap-4">
          <button
            type="button"
            onClick={() => setQuestionType("objective")}
            className={`p-3 rounded-lg border transition-colors ${
              questionType === "objective"
                ? "border-purple-500 bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-300"
                : "border-gray-300 hover:border-purple-400"
            }`}
          >
            Objective
          </button>
          <button
            type="button"
            onClick={() => setQuestionType("theory")}
            className={`p-3 rounded-lg border transition-colors ${
              questionType === "theory"
                ? "border-purple-500 bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-300"
                : "border-gray-300 hover:border-purple-400"
            }`}
          >
            Theory
          </button>
          <button
            type="button"
            onClick={() => setQuestionType("both")}
            className={`p-3 rounded-lg border transition-colors ${
              questionType === "both"
                ? "border-purple-500 bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-300"
                : "border-gray-300 hover:border-purple-400"
            }`}
          >
            Both
          </button>
        </div>
      </div>

      {(questionType === "objective" || questionType === "both") && (
        <div>
          <label className="block text-sm font-medium mb-2">
            Number of Objective Questions: {numObjectiveQuestions}
          </label>
          <input
            type="range"
            min="1"
            max="100"
            value={numObjectiveQuestions}
            onChange={(e) => setNumObjectiveQuestions(parseInt(e.target.value))}
            className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-purple-600 dark:bg-gray-700"
          />
          <div className="flex justify-between text-xs text-gray-500 mt-1">
            <span>1</span>
            <span>50</span>
            <span>100</span>
          </div>
        </div>
      )}

      {(questionType === "theory" || questionType === "both") && (
        <div>
          <label className="block text-sm font-medium mb-2">
            Number of Theory Questions: {numTheoryQuestions}
          </label>
          <input
            type="range"
            min="1"
            max="20"
            value={numTheoryQuestions}
            onChange={(e) => setNumTheoryQuestions(parseInt(e.target.value))}
            className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-purple-600 dark:bg-gray-700"
          />
          <div className="flex justify-between text-xs text-gray-500 mt-1">
            <span>1</span>
            <span>10</span>
            <span>20</span>
          </div>
        </div>
      )}
    </div>
  );
};

export default QuestionTypeSelector;
