import axios from "axios";
import { Question } from "../contexts/StudyContext";

const API_URL = import.meta.env.VITE_SERVER || "http://localhost:3000";

export const generateQuestions = async (
  file: File,
  type: "objective" | "theory" | "both",
  objectiveCount: number,
  theoryCount: number
): Promise<Question[]> => {
  const formData = new FormData();
  formData.append("file", file);
  formData.append("type", type);
  formData.append("objectiveCount", objectiveCount.toString());
  formData.append("theoryCount", theoryCount.toString());

  try {
    const response = await axios.post(`${API_URL}/api/generate`, formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
    return response.data.questions;
  } catch (error) {
    console.error("Error generating questions:", error);
    throw new Error("Failed to generate questions. Please try again.");
  }
};
