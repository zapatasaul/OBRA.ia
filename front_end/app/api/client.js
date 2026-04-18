import axios from "axios";

const API_URL = "http://localhost:4000/api";

export const analyzeDocument = async (
  files,
  location,
  conditions,
  proyectName,
  materials,
) => {
  const formData = new FormData();
  files.forEach((file) => formData.append("files", file));
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

export const fetchProjects = async () => {
  try {
    const response = await axios.get(`${API_URL}/database`);
    return response.data.data || [];
  } catch (error) {
    console.error("Error fetching projects:", error);
    return [];
  }
};
