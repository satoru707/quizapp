/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Download, ArrowLeft } from "lucide-react";
import QuestionCard from "../components/QuestionCard";
import { useStudy } from "../contexts/StudyContext";
import { exportToPdf } from "../utils/exportToPdf";

interface Question {
  id: string | number;
  text: string;
  answer: string;
  options: string[];
  explanation?: string;
  type: "objective" | "theory";
  idx?: number;
}

const Questions: React.FC = () => {
  const { questions = [], currentSession, file, saveSession } = useStudy();
  const navigate = useNavigate();
  const [showTypeFilter, setShowTypeFilter] = useState<
    "all" | "objective" | "theory"
  >("all");
  const [searchTerm, setSearchTerm] = useState("");

  // Normalize questions data structure
  const normalizeQuestions = (rawQuestions: any): Question[] => {
    if (!rawQuestions) return [];

    if (Array.isArray(rawQuestions)) {
      return rawQuestions.map((q) => ({
        id: q.id || Math.random().toString(36).substring(2, 9),
        text: q.text || "",
        options: q.options || [],
        answer: q.answer || "",
        explanation: q.explanation,
        type: q.type || "objective",
        idx: q.idx,
      }));
    }

    if (rawQuestions.questions && Array.isArray(rawQuestions.questions)) {
      return rawQuestions.questions.map((q: any) => ({
        id: q.id || Math.random().toString(36).substring(2, 9),
        text: q.text || "",
        answer: q.answer || "",
        options: q.options || [],
        explanation: q.explanation,
        type: q.type || "objective",
        idx: q.idx,
      }));
    }

    return [];
  };

  const safeQuestions = normalizeQuestions(questions);

  useEffect(() => {
    if (safeQuestions.length === 0 && !currentSession) {
      navigate("/");
    }
    saveSession();
    console.log(currentSession, "currentSession");
  }, [safeQuestions, currentSession, navigate]);
  const handleDownloadPdf = () => {
    if (displayedQuestions.length === 0) {
      console.log("No questions to export!");
      return;
    }

    exportToPdf(displayedQuestions, file?.name || "questions.pdf");
    console.log("Export started...");
  };

  const getQuestionsToDisplay = () => {
    let filtered = safeQuestions;

    if (showTypeFilter !== "all") {
      filtered = filtered.filter((q) => q.type === showTypeFilter);
    }

    if (searchTerm.trim() !== "") {
      const search = searchTerm.toLowerCase();
      filtered = filtered.filter(
        (q) =>
          q.text.toLowerCase().includes(search) ||
          q.answer.toLowerCase().includes(search) ||
          (q.explanation && q.explanation.toLowerCase().includes(search))
      );
    }

    return filtered;
  };

  // Function to generate fancy ID badge
  const renderFancyId = (id: string | number) => {
    const idStr = id.toString();
    return (
      <span className="inline-flex items-center justify-center px-3 py-1 rounded-full bg-gradient-to-r from-purple-500 to-purple-700 text-white text-xs font-bold shadow-md">
        <span className="mr-1">#</span>
        {idStr}
      </span>
    );
  };

  const displayedQuestions = getQuestionsToDisplay();
  const objectiveCount = safeQuestions.filter(
    (q) => q.type === "objective"
  ).length;
  const theoryCount = safeQuestions.filter((q) => q.type === "theory").length;

  if (safeQuestions.length === 0) {
    return (
      <div className="flex justify-center items-center h-64">
        <p>No questions available. Please generate questions first.</p>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto">
      {/* Header and controls remain the same */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6">
        <div>
          <button
            onClick={() => navigate("/")}
            className="inline-flex items-center text-sm text-gray-600 dark:text-gray-300 hover:text-purple-600 dark:hover:text-purple-400 mb-2 sm:mb-0"
          >
            <ArrowLeft className="h-4 w-4 mr-1" />
            Back to Generator
          </button>
          <h1 className="text-2xl font-bold">
            Study Questions
            {file && (
              <span className="text-sm font-normal text-gray-500 dark:text-gray-400 ml-2">
                ({file.name})
              </span>
            )}
          </h1>
        </div>

        <button
          onClick={handleDownloadPdf}
          className="inline-flex items-center px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors"
        >
          <Download className="h-4 w-4 mr-2" />
          Download PDF
        </button>
      </div>

      {/* Filter controls remain the same */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-4 mb-6">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div className="flex space-x-4">
            <button
              onClick={() => setShowTypeFilter("all")}
              className={`px-3 py-1 rounded-full text-sm ${
                showTypeFilter === "all"
                  ? "bg-purple-600 text-white"
                  : "bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-gray-200 hover:bg-gray-300 dark:hover:bg-gray-600"
              }`}
            >
              All ({safeQuestions.length})
            </button>
            {objectiveCount > 0 && (
              <button
                onClick={() => setShowTypeFilter("objective")}
                className={`px-3 py-1 rounded-full text-sm ${
                  showTypeFilter === "objective"
                    ? "bg-purple-600 text-white"
                    : "bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-gray-200 hover:bg-gray-300 dark:hover:bg-gray-600"
                }`}
              >
                Objective ({objectiveCount})
              </button>
            )}
            {theoryCount > 0 && (
              <button
                onClick={() => setShowTypeFilter("theory")}
                className={`px-3 py-1 rounded-full text-sm ${
                  showTypeFilter === "theory"
                    ? "bg-purple-600 text-white"
                    : "bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-gray-200 hover:bg-gray-300 dark:hover:bg-gray-600"
                }`}
              >
                Theory ({theoryCount})
              </button>
            )}
          </div>

          <div className="w-full sm:w-auto">
            <input
              type="text"
              placeholder="Search questions..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg w-full sm:w-64 bg-white dark:bg-gray-700"
            />
          </div>
        </div>
      </div>

      {/* Questions list with fancy IDs */}
      <div className="space-y-6">
        {displayedQuestions.length > 0 ? (
          displayedQuestions.map((question) => (
            <div key={question.id} className="relative">
              <div className="absolute -left-2 -top-3 transform -translate-y-1/2">
                {renderFancyId(question.id)}
              </div>
              <QuestionCard
                question={{
                  ...question,
                  index:
                    question.idx !== undefined ? question.idx : question.id,
                }}
              />
            </div>
          ))
        ) : (
          <div className="text-center p-8 bg-white dark:bg-gray-800 rounded-lg shadow">
            <p className="text-gray-500 dark:text-gray-400">
              No questions match your filter criteria.
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Questions;
