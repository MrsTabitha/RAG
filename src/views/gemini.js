const { GoogleGenerativeAI } = require("@google/generative-ai");

const API_KEY = "AIzaSyBsQJC4kQc9OG8H9jqO0n_Zon6znnP8Ew0";
const genAI = new GoogleGenerativeAI(API_KEY);

async function gerarResposta(promptUsuario) {
    // Observe que agora o modelo tem o prefixo 'models/'
    const model = genAI.getGenerativeModel({ model: "models/gemini-1.5-flash" });

    const promptFinal = `Você é um assistente técnico. Responda com clareza e objetividade sobre hardware de computadores. Pergunta: ${promptUsuario}`;

    /*const promptFinal = `Recomende jogos que rodem bem com a combinação ${promptUsuario}. `;*/

    const result = await model.generateContent(promptFinal);
    const response = await result.response;
    const text = response.text();

    return text;
}

async function obterRespostaGemini(pergunta) {
    return await gerarResposta(pergunta);
}

module.exports = {
    gerarResposta,
    obterRespostaGemini
};
