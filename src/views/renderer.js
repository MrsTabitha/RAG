// Recupera o usuário logado do armazenamento local (localStorage)
let usuarioAtual = localStorage.getItem('usuarioAtual');

// Função que limpa os campos do formulário de login e garante que estão habilitados
function limparFormularioLogin() {
    
    const form = document.getElementById('login-form');
    if (form) {
        form.reset();
        const usernameInput = document.getElementById('username');
        const passwordInput = document.getElementById('password');

        if (usernameInput) {
            usernameInput.value = '';
            usernameInput.disabled = false;
            usernameInput.readOnly = false;
        }

        if (passwordInput) {
            passwordInput.value = '';
            passwordInput.disabled = false;
            passwordInput.readOnly = false;
        }
    }
}

/* ===========================
    BLOCO DE LOGIN
   =========================== */
if (document.getElementById('login-form')) {

    // Habilita manualmente os campos, caso o reset os deixe travados
    document.getElementById('username').disabled = false;
    document.getElementById('username').readOnly = false;
    document.getElementById('password').disabled = false;
    document.getElementById('password').readOnly = false;

    // Força a habilitação dos campos após 1 segundo
    setTimeout(() => {
        document.getElementById('username').disabled = false;
        document.getElementById('username').readOnly = false;
        document.getElementById('password').disabled = false;
        document.getElementById('password').readOnly = false;
        console.log('Campos de login forçados a habilitar após 1s');
    }, 1000);

    // Trata o envio do formulário de login
    document.getElementById('login-form').addEventListener('submit', async function (e) {

        e.preventDefault();
        const username = document.getElementById('username').value;
        const password = document.getElementById('password').value;
        
        console.log('Iniciando busca de usuários...');
        const inicio = Date.now();
        const usuarios = await window.api.getUsuarios();
        const fim = Date.now();
        console.log('Tempo de resposta getUsuarios:', (fim - inicio), 'ms');

        // Verifica se o usuário e a senha existem e batem
        if (usuarios[username] && usuarios[username].senha === password) {
            localStorage.setItem('usuarioAtual', username);
            console.log('Login bem-sucedido! Redirecionando...');
            window.api.redirecionarParaChat(); // Solicita ao processo principal para mudar de página
        } else {
            alert('Usuário ou senha incorretos');
            // limparFormularioLogin();
        }
    });
}

/* ===========================
    BLOCO DE CADASTRO
   =========================== */
if (document.getElementById('cadastro-form')) {

    document.getElementById('cadastro-form').addEventListener('submit', async function (e) {
        e.preventDefault();
        const username = document.getElementById('new-username').value;
        const password = document.getElementById('new-password').value;
        
        const usuarios = await window.api.getUsuarios();
        
        if (usuarios[username]) {
            alert('Usuário já existe!');
            return;
        }

        // Adiciona novo usuário e salva na base local
        usuarios[username] = { senha: password };
        await window.api.setUsuarios(usuarios);

        alert('Cadastro realizado com sucesso!');
        localStorage.removeItem('usuarioAtual'); // Remove qualquer login antigo
        window.location.href = 'index.html'; // Redireciona para a tela de login
    });
}

// Função de logout: limpa login atual e volta pra tela inicial
function logout() {
    localStorage.removeItem('usuarioAtual');
    window.location.href = 'index.html';
}

/* ===========================
    BLOCO DO CHATBOT
   =========================== */

// Elementos da interface
const form = document.getElementById('chat-form');
const input = document.getElementById('chat-input');
const messagesDiv = document.getElementById('chat-messages');
const logoutBtn = document.getElementById('logout-btn');

// Botão de logout
logoutBtn.addEventListener('click', () => {
    localStorage.removeItem('usuarioAtual');
    window.location.href = 'index.html';
});

// Envia mensagem no chat
form.addEventListener('submit', async (e) => {
    e.preventDefault();
    const msg = input.value.trim();
    if (!msg) return;

    // Exibe a mensagem do usuário
    const userDiv = document.createElement('div');
    userDiv.classList.add('user-message');
    userDiv.textContent = msg;
    messagesDiv.appendChild(userDiv);
    messagesDiv.scrollTop = messagesDiv.scrollHeight;

    input.value = '';

    // Exibe texto de "Pensando..." enquanto aguarda resposta
    const botDiv = document.createElement('div');
    botDiv.classList.add('bot-message');
    botDiv.textContent = "Pensando...";
    messagesDiv.appendChild(botDiv);
    messagesDiv.scrollTop = messagesDiv.scrollHeight;

    try {
        // Solicita a resposta ao Gemini via API do Electron
        const resposta = await window.api.gerarResposta(msg);
        botDiv.textContent = resposta;
    } catch (error) {
        botDiv.textContent = "Erro ao obter resposta do Gemini.";
        console.error(error);
    }

    messagesDiv.scrollTop = messagesDiv.scrollHeight;
});