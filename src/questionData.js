const API_BASE_URL =
  process.env.REACT_APP_API_URL || "http://localhost:5000";

export const loadQuestions = async () => {
  const response = await fetch(`${API_BASE_URL}/api/questions`);

  if (!response.ok) {
    throw new Error("질문을 불러오지 못했습니다.");
  }

  const data = await response.json();

  return data;
};