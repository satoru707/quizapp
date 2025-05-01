import React, { createContext, useState, useContext, useEffect } from "react";
import { generateQuestions } from "../services/apiService";
import { saveToLocalStorage, getFromLocalStorage } from "../utils/localStorage";

interface StudyContextType {
  file: File | null;
  setFile: (file: File | null) => void;
  questionType: "objective" | "theory" | "both";
  setQuestionType: (type: "objective" | "theory" | "both") => void;
  numObjectiveQuestions: number;
  setNumObjectiveQuestions: (num: number) => void;
  numTheoryQuestions: number;
  setNumTheoryQuestions: (num: number) => void;
  questions: Question[];
  setQuestions: (questions: Question[]) => void;
  loading: boolean;
  generateStudyQuestions: () => Promise<void>;
  error: string | null;
  history: StudySession[];
  currentSession: StudySession | null;
  setCurrentSession: (session: StudySession | null) => void;
  saveSession: () => void;
}

export interface Question {
  id: string;
  text: string;
  answer: string;
  explanation: string;
  type: "objective" | "theory";
}

export interface StudySession {
  id: string;
  date: string;
  filename: string;
  fileType: string;
  questionType: "objective" | "theory" | "both";
  numObjectiveQuestions: number;
  numTheoryQuestions: number;
  questions: Question[];
}

const StudyContext = createContext<StudyContextType | undefined>(undefined);

export const StudyProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [file, setFile] = useState<File | null>(null);
  const [questionType, setQuestionType] = useState<
    "objective" | "theory" | "both"
  >("both");
  const [numObjectiveQuestions, setNumObjectiveQuestions] =
    useState<number>(10);
  const [numTheoryQuestions, setNumTheoryQuestions] = useState<number>(5);
  const [questions, setQuestions] = useState<Question[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [history, setHistory] = useState<StudySession[]>([]);
  const [currentSession, setCurrentSession] = useState<StudySession | null>(
    null
  );

  useEffect(() => {
    const savedHistory =
      (getFromLocalStorage("study-history") as StudySession[]) || [];
    setHistory(savedHistory);
  }, []);

  const generateStudyQuestions = async () => {
    if (!file) {
      setError("Please upload a file first");
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const objectiveCount =
        questionType === "theory" ? 0 : numObjectiveQuestions;
      const theoryCount = questionType === "objective" ? 0 : numTheoryQuestions;

      const generatedQuestions = await generateQuestions(
        file,
        questionType,
        objectiveCount,
        theoryCount
      );

      setQuestions(generatedQuestions);

      const newSession: StudySession = {
        id: Date.now().toString(),
        date: new Date().toISOString(),
        filename: file.name,
        fileType: file.type,
        questionType,
        numObjectiveQuestions: objectiveCount,
        numTheoryQuestions: theoryCount,
        questions: generatedQuestions,
      };

      setCurrentSession(newSession);
    } catch (err) {
      setError("Failed to generate questions. Please try again.");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const saveSession = () => {
    if (currentSession) {
      const updatedHistory = [currentSession, ...history];
      setHistory(updatedHistory);
      saveToLocalStorage("study-history", updatedHistory);
    }
  };

  return (
    <StudyContext.Provider
      value={{
        file,
        setFile,
        questionType,
        setQuestionType,
        numObjectiveQuestions,
        setNumObjectiveQuestions,
        numTheoryQuestions,
        setNumTheoryQuestions,
        questions,
        setQuestions,
        loading,
        generateStudyQuestions,
        error,
        history,
        currentSession,
        setCurrentSession,
        saveSession,
      }}
    >
      {children}
    </StudyContext.Provider>
  );
};

export const useStudy = (): StudyContextType => {
  const context = useContext(StudyContext);
  if (context === undefined) {
    throw new Error("useStudy must be used within a StudyProvider");
  }
  return context;
};
