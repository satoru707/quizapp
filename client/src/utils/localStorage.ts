import { StudySession } from "../contexts/StudyContext";

export const saveToLocalStorage = (key: string, data: any): void => {
  try {
    localStorage.setItem(key, JSON.stringify(data));
  } catch (error) {
    console.error("Error saving to localStorage:", error);
  }
};

export const getFromLocalStorage = (key: string): any => {
  try {
    const item = localStorage.getItem(key);
    return item ? JSON.parse(item) : null;
  } catch (error) {
    console.error("Error getting from localStorage:", error);
    return null;
  }
};

export const deleteHistoryItem = (id: string): StudySession[] => {
  try {
    const history =
      (getFromLocalStorage("study-history") as StudySession[]) || [];
    const updatedHistory = history.filter((item) => item.id !== id);
    saveToLocalStorage("study-history", updatedHistory);
    return updatedHistory;
  } catch (error) {
    console.error("Error deleting history item:", error);
    return [];
  }
};
