/*
 * Install the Generative AI SDK
 *
 * $ npm install @google/generative-ai
 *
 * See the getting started guide for more information
 * https://ai.google.dev/gemini-api/docs/get-started/node
 */

import {GoogleGenerativeAI,
    HarmCategory,
    HarmBlockThreshold} from "@google/generative-ai";
  
  const apiKey = import.meta.env.VITE_GOOGLE_API_KEY;
  const genAI = new GoogleGenerativeAI(apiKey);
  
  const model = genAI.getGenerativeModel({
    model: "gemini-1.5-flash",
  });
  
  const generationConfig = {
    temperature: 1,
    topP: 0.95,
    topK: 64,
    maxOutputTokens: 8192,
    responseMimeType: "text/plain",
  };

  const safetySetting = [
    {
      category: HarmCategory.HARM_CATEGORY_HARASSMENT,
      threshold: HarmBlockThreshold.BLOCK_LOW_AND_ABOVE,
    },
    {
      category: HarmCategory.HARM_CATEGORY_HATE_SPEECH,
      threshold: HarmBlockThreshold.BLOCK_LOW_AND_ABOVE,
    },
  ];
  
  async function run(textInput, chatHistory) {
    const history = (chatHistory || []).map((item) =>{
      return{
        role: item.isBot ? 'model' : 'user',
        parts: [{text: item.text}]
      }
    })
    const chatSession = model.startChat({
      generationConfig,
      safetySetting,
      history: history,
    });
  
    const result = await chatSession.sendMessage(textInput);
    return result.response.text()
  }
  
export default run;