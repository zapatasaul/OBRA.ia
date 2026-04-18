import axios from "axios";

const API_URL = "http://localhost:4000/api";

export const analyzeDocument = async (file, location, conditions, proyectName, materials) => {
  const formData = new FormData();
  formData.append("file", file);
  formData.append("location", location);
  formData.append("conditions", conditions);
  formData.append("proyectName", proyectName);
  formData.append("materials", materials);

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
