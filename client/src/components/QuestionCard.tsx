/* eslint-disable @typescript-eslint/no-unused-vars */
import React, { useState } from "react";
import { ChevronDown, ChevronUp } from "lucide-react";
import { Question } from "../contexts/StudyContext";

interface QuestionCardProps {
  question: Question;
  index: number;
}

const QuestionCard: React.FC<QuestionCardProps> = ({ question, index }) => {
  const [isExpanded, setIsExpanded] = useState(false);
  console.log(question);

  return (
    <div
      className={`mb-4 rounded-lg border transition-all duration-300 overflow-hidden
        ${
          isExpanded
            ? "border-purple-300 dark:border-purple-700 shadow-md"
            : "border-gray-200 dark:border-gray-700"
        }`}
    >
      <div className="p-4">
        <div className="flex items-start justify-between">
          <div>
            <span className="inline-block px-2 py-1 text-xs rounded-full bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200 mb-3">
              {question.type === "objective" ? "Objective" : "Theory"}
            </span>
            <h3 className="text-lg font-medium">{question.text}</h3>
            {question.type === "objective" && (
              <div className="mt-3 space-y-2">
                {question.options.map((option, index) => (
                  <div key={index} className="flex items-center">
                    <input
                      type="radio"
                      id={`option-${index}`}
                      name="question-option"
                      className="mr-2"
                    />
                    <label htmlFor={`option-${index}`}>{option}</label>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      <div
        className={`overflow-hidden transition-all duration-300 ${
          isExpanded ? "max-h-[1000px]" : "max-h-0"
        }`}
      >
        <div className="p-4 pt-0">
          <div className="mt-2 border-t pt-4">
            <h4 className="font-bold text-sm text-gray-500 dark:text-gray-400 mb-2">
              Answer:
            </h4>
            <p className="mb-3">{question.answer}</p>

            <h4 className="font-bold text-sm text-gray-500 dark:text-gray-400 mb-2">
              Explanation:
            </h4>
            <p className="text-gray-700 dark:text-gray-300">
              {question.explanation}
            </p>
          </div>
        </div>
      </div>

      <button
        onClick={() => setIsExpanded(!isExpanded)}
        className="w-full flex items-center justify-center p-2 border-t border-gray-200 dark:border-gray-700 text-sm text-gray-500 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
      >
        {isExpanded ? (
          <>
            <ChevronUp className="h-4 w-4 mr-1" />
            Hide Answer
          </>
        ) : (
          <>
            <ChevronDown className="h-4 w-4 mr-1" />
            Show Answer
          </>
        )}
      </button>
    </div>
  );
};

export default QuestionCard;
