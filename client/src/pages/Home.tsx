import React from "react";
import { useNavigate } from "react-router-dom";
import { Brain, FileQuestion, History } from "lucide-react";
import FileUpload from "../components/FileUpload";
import QuestionTypeSelector from "../components/QuestionTypeSelector";
import GenerateButton from "../components/GenerateButton";
import { useStudy } from "../contexts/StudyContext";

const Home: React.FC = () => {
  const navigate = useNavigate();
  const { saveSession } = useStudy();

  const handleSuccess = () => {
    saveSession();
    navigate("/questions");
  };

  return (
    <div className="max-w-4xl mx-auto">
      <section className="mb-12 text-center">
        <h1 className="text-3xl md:text-4xl font-bold mb-4">
          Create AI-Powered Study Questions
        </h1>
        <p className="text-lg text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
          Upload any document and StudyBuddy will generate custom study
          questions to help you learn and retain information more effectively.
        </p>
      </section>

      <div className="grid md:grid-cols-2 gap-8">
        <div className="space-y-6 order-2 md:order-1">
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md p-6">
            <h2 className="text-xl font-bold mb-6 flex items-center">
              <FileQuestion className="h-6 w-6 mr-2 text-purple-600" />
              Create Study Questions
            </h2>

            <FileUpload />
            <QuestionTypeSelector />

            <div className="mt-8">
              <GenerateButton onSuccess={handleSuccess} />
            </div>
          </div>
        </div>

        <div className="space-y-6 order-1 md:order-2">
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md p-6">
            <h2 className="text-xl font-bold mb-6 flex items-center">
              <Brain className="h-6 w-6 mr-2 text-purple-600" />
              How It Works
            </h2>

            <ol className="space-y-4">
              <li className="flex">
                <span className="bg-purple-100 dark:bg-purple-900/30 text-purple-800 dark:text-purple-200 h-6 w-6 rounded-full flex items-center justify-center mr-3 shrink-0">
                  1
                </span>
                <p>Upload any document file (PDF, DOCX, PPTX or TXT)</p>
              </li>
              <li className="flex">
                <span className="bg-purple-100 dark:bg-purple-900/30 text-purple-800 dark:text-purple-200 h-6 w-6 rounded-full flex items-center justify-center mr-3 shrink-0">
                  2
                </span>
                <p>Select question type and quantity</p>
              </li>
              <li className="flex">
                <span className="bg-purple-100 dark:bg-purple-900/30 text-purple-800 dark:text-purple-200 h-6 w-6 rounded-full flex items-center justify-center mr-3 shrink-0">
                  3
                </span>
                <p>Our AI generates custom questions and answers</p>
              </li>
              <li className="flex">
                <span className="bg-purple-100 dark:bg-purple-900/30 text-purple-800 dark:text-purple-200 h-6 w-6 rounded-full flex items-center justify-center mr-3 shrink-0">
                  4
                </span>
                <p>Study with interactive question cards or download as PDF</p>
              </li>
            </ol>
          </div>

          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md p-6">
            <h2 className="text-xl font-bold mb-6 flex items-center">
              <History className="h-6 w-6 mr-2 text-purple-600" />
              Features
            </h2>

            <ul className="space-y-3">
              <li className="flex items-start">
                <span className="text-green-500 mr-2">✓</span>
                <span>AI-powered question generation from any document</span>
              </li>
              <li className="flex items-start">
                <span className="text-green-500 mr-2">✓</span>
                <span>
                  Both objective and theory questions with explanations
                </span>
              </li>
              <li className="flex items-start">
                <span className="text-green-500 mr-2">✓</span>
                <span>Download questions as PDF for offline studying</span>
              </li>
              <li className="flex items-start">
                <span className="text-green-500 mr-2">✓</span>
                <span>Save study sessions to review later</span>
              </li>
              <li className="flex items-start">
                <span className="text-green-500 mr-2">✓</span>
                <span>All data stored locally in your browser</span>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Home;
