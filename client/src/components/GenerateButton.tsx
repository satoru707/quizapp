import React from "react";
import { Loader } from "lucide-react";
import { useStudy } from "../contexts/StudyContext";

interface GenerateButtonProps {
  onSuccess?: () => void;
}

const GenerateButton: React.FC<GenerateButtonProps> = ({ onSuccess }) => {
  const { file, loading, generateStudyQuestions, error } = useStudy();

  const handleGenerate = async () => {
    await generateStudyQuestions();

    if (onSuccess) onSuccess();
  };

  return (
    <div>
      <button
        onClick={handleGenerate}
        disabled={!file || loading}
        className={`w-full py-3 px-4 rounded-lg font-medium flex items-center justify-center space-x-2 transition-colors
          ${
            !file || loading
              ? "bg-gray-300 text-gray-500 cursor-not-allowed dark:bg-gray-700 dark:text-gray-400"
              : "bg-purple-600 text-white hover:bg-purple-700"
          }`}
      >
        {loading ? (
          <>
            <Loader className="h-5 w-5 animate-spin" />
            <span>Generating Questions...</span>
          </>
        ) : (
          <span>Generate Questions</span>
        )}
      </button>

      {error && <p className="mt-2 text-sm text-red-500">{error}</p>}

      {!file && !loading && (
        <p className="mt-2 text-sm text-gray-500 dark:text-gray-400">
          Please upload a file to generate questions
        </p>
      )}
    </div>
  );
};

export default GenerateButton;
