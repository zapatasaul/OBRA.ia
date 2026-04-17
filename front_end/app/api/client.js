import axios from "axios";

const API_URL = "http://localhost:4000/api";

export const analyzeDocument = async (file, location) => {
  const formData = new FormData();
  formData.append("file", file);
  formData.append("location", location);

  const response = await axios.post(`${API_URL}/analyze-plan`, formData);
  return response.data;
};

export const sendTechnicalQuery = async (question, context) => {
  const response = await axios.post(`${API_URL}/chat-tecnico`, {
    question,
    context,
  });
  return response.data;
};
