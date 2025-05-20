const fs = require('fs');
const path = require('path');

const USERS_FILE = path.join(__dirname, 'users.json');

// Função para garantir que o arquivo existe
function ensureFileExists() {
    if (!fs.existsSync(USERS_FILE)) {
        fs.writeFileSync(USERS_FILE, JSON.stringify({}));
    }
}

// Função para ler os usuários
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

// Função para salvar os usuários
function setUsuarios(usuarios) {
    try {
        fs.writeFileSync(USERS_FILE, JSON.stringify(usuarios, null, 2));
    } catch (error) {
        console.error('Erro ao salvar arquivo de usuários:', error);
    }
}

module.exports = {
    getUsuarios,
    setUsuarios
}; 