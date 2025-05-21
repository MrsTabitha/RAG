const fs = require('fs');
const path = require('path');

// Define o caminho absoluto para o arquivo users.json, onde os dados dos usuários serão armazenados.
const USERS_FILE = path.join(__dirname, 'users.json');


// Essa função aqui garante que o arquivo users.json exista.
// Se ele não existir, ela cria um arquivo vazio com um objeto JSON.
function ensureFileExists() {
    if (!fs.existsSync(USERS_FILE)) {
        fs.writeFileSync(USERS_FILE, JSON.stringify({}));
    }
}


// Aqui a gente lê o arquivo de usuários.
// Primeiro garante que o arquivo existe, depois lê e transforma o conteúdo em objeto.
// Se der algum erro, retorna um objeto vazio.
function getUsuarios() {
    ensureFileExists();
    try {
        const data = fs.readFileSync(USERS_FILE, 'utf8');
        return JSON.parse(data);
    } catch (error) {
        console.error('Erro ao ler arquivo de usuários:', error);
        return {};
    }
}


// Essa função salva os dados dos usuários no arquivo.
// Ela sobrescreve o arquivo com os dados formatados.
// Se acontecer algum erro durante a escrita, ele é mostrado no console.
function setUsuarios(usuarios) {
    try {
        fs.writeFileSync(USERS_FILE, JSON.stringify(usuarios, null, 2));
    } catch (error) {
        console.error('Erro ao salvar arquivo de usuários:', error);
    }
}


// Exporta as funções pra poder usar em outros arquivos do projeto.
module.exports = {
    getUsuarios,
    setUsuarios
};
