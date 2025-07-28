import axios from 'axios';

const GEMINI_API_URL = 'https://generativelanguage.googleapis.com/v1/models/gemini-1.5-flash:generateContent';
const GEMINI_API_KEY = 'AIzaSyDB8DBGlX_yLnT6e1XBRsM1_oQFLMF_viw'; 

export const chatWithGemini = async (message) => {
  try {
    const response = await axios.post(
      `${GEMINI_API_URL}?key=${GEMINI_API_KEY}`,
      {
        contents: [
          {
            parts: [{ text: message }],
          },
        ],
      },
      {
        headers: {
          'Content-Type': 'application/json',
        },
      }
    );

    const reply = response.data?.candidates?.[0]?.content?.parts?.[0]?.text;
    return reply || 'Không có phản hồi';
  } catch (error) {
    if (error.response) {
      console.error('❌ Lỗi gọi Gemini API:', error.response.data);
      return `Lỗi Gemini: ${error.response.data?.error?.message || error.message}`;
    } else {
      console.error('❌ Lỗi gọi Gemini API:', error);
      return `Lỗi khi gọi chatbot: ${error.message}`;
    }
  }
};
