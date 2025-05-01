import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Calendar, FileText, ChevronRight, Trash2, Search } from "lucide-react";
import { useStudy } from "../contexts/StudyContext";
import { formatDate } from "../utils/formatters";
import { deleteHistoryItem } from "../utils/localStorage";

const History: React.FC = () => {
  const { history, setQuestions, setCurrentSession } = useStudy();
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState("");
  const [updatedHistory, setUpdatedHistory] = useState(history);

  const loadSession = (sessionId: string) => {
    const session = history.find((s) => s.id === sessionId);
    if (session) {
      setQuestions(session.questions);
      navigate("/questions");
    }
  };

  const handleDelete = (sessionId: string, e: React.MouseEvent) => {
    e.stopPropagation();
    const updatedHistor = deleteHistoryItem(sessionId);
    console.log("Deleted session with ID:", sessionId);
    setCurrentSession(null);
    setUpdatedHistory(updatedHistor);
    navigate("/history");
  };

  const filteredHistory = updatedHistory.filter((session) =>
    session.filename.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="max-w-4xl mx-auto">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Study History</h1>
      </div>

      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-4 mb-6">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500 dark:text-gray-400 h-5 w-5" />
          <input
            type="text"
            placeholder="Search by filename..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700"
          />
        </div>
      </div>

      {filteredHistory.length > 0 ? (
        <div className="space-y-4">
          {filteredHistory.map((session) => (
            <div
              key={session.id}
              onClick={() => loadSession(session.id)}
              className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-4 flex justify-between items-center hover:shadow-lg transition-shadow cursor-pointer"
            >
              <div className="flex items-start space-x-4">
                <div className="p-2 bg-purple-100 dark:bg-purple-900/20 rounded-lg">
                  <FileText className="h-6 w-6 text-purple-600 dark:text-purple-400" />
                </div>
                <div>
                  <h3 className="font-medium">{session.filename}</h3>
                  <div className="flex items-center text-sm text-gray-500 dark:text-gray-400 mt-1">
                    <Calendar className="h-4 w-4 mr-1" />
                    <span>{formatDate(session.date)}</span>
                  </div>
                  <div className="flex flex-wrap mt-2 gap-2">
                    <span className="text-xs px-2 py-1 bg-gray-100 dark:bg-gray-700 rounded-full">
                      {session.questionType === "both"
                        ? "Objective & Theory"
                        : session.questionType.charAt(0).toUpperCase() +
                          session.questionType.slice(1)}
                    </span>
                    <span className="text-xs px-2 py-1 bg-gray-100 dark:bg-gray-700 rounded-full">
                      {session.questions.length} questions
                    </span>
                  </div>
                </div>
              </div>
              <div className="flex items-center space-x-2">
                <button
                  onClick={(e) => handleDelete(session.id, e)}
                  className="p-2 text-gray-500 hover:text-red-500 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700"
                  aria-label="Delete session"
                >
                  <Trash2 className="h-5 w-5" />
                </button>
                <ChevronRight className="h-5 w-5 text-gray-400" />
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center p-8 bg-white dark:bg-gray-800 rounded-lg shadow">
          <p className="text-gray-500 dark:text-gray-400">
            {searchTerm
              ? "No matching study sessions found."
              : "No study history yet. Generate questions to get started!"}
          </p>
          {searchTerm ? (
            <button
              onClick={() => setSearchTerm("")}
              className="mt-4 px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors"
            >
              Clear Search
            </button>
          ) : (
            <button
              onClick={() => navigate("/")}
              className="mt-4 px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors"
            >
              Generate Questions
            </button>
          )}
        </div>
      )}
    </div>
  );
};

export default History;
