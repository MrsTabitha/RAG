let usuarioAtual = localStorage.getItem('usuarioAtual');

// Função para limpar e habilitar campos do formulário
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

// Login
if (document.getElementById('login-form')) {
    // Remover reset automático para testar se é isso que está causando o bug
    // limparFormularioLogin();

    document.getElementById('username').disabled = false;
    document.getElementById('username').readOnly = false;
    document.getElementById('password').disabled = false;
    document.getElementById('password').readOnly = false;

    // Forçar habilitação dos campos após 1 segundo
    setTimeout(() => {
        document.getElementById('username').disabled = false;
        document.getElementById('username').readOnly = false;
        document.getElementById('password').disabled = false;
        document.getElementById('password').readOnly = false;
        console.log('Campos de login forçados a habilitar após 1s');
    }, 1000);

    document.getElementById('login-form').addEventListener('submit', async function (e) {
        e.preventDefault();
        const username = document.getElementById('username').value;
        const password = document.getElementById('password').value;
        console.log('Iniciando busca de usuários...');
        const inicio = Date.now();
        const usuarios = await window.api.getUsuarios();
        const fim = Date.now();
        console.log('Tempo de resposta getUsuarios:', (fim - inicio), 'ms');
        if (usuarios[username] && usuarios[username].senha === password) {
            localStorage.setItem('usuarioAtual', username);
            window.location.href = 'preferencias.html';
        } else {
            alert('Usuário ou senha incorretos');
            // limparFormularioLogin();
        }
    });
}

// Formulário de Cadastro
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
        usuarios[username] = { senha: password, preferencias: [] };
        await window.api.setUsuarios(usuarios);
        alert('Cadastro realizado com sucesso!');
        // Limpar o localStorage antes de redirecionar
        localStorage.removeItem('usuarioAtual');
        window.location.href = 'index.html';
    });
}

function logout() {
    localStorage.removeItem('usuarioAtual');
    window.location.href = 'index.html';
}

