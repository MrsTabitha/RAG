const { app, BrowserWindow, ipcMain, nativeTheme, Menu, shell } = require('electron');
const path = require('path');
const { getUsuarios, setUsuarios } = require('./userStorage');
const { gerarResposta, obterRespostaGemini } = require(path.join(__dirname, 'src', 'views', 'gemini.js'));

let win;

// Função principal pra criar a janela da aplicação
// Aqui a gente define tamanho, ícone, configurações de segurança e qual HTML será carregado
function createWindow() {
    nativeTheme.themeSource = 'light'; // força o tema claro (poderia ser 'dark' ou 'system')
    
    win = new BrowserWindow({
        width: 1000,
        height: 800,
        icon: './src/public/img/icone.png',
        webPreferences: {
            preload: path.join(__dirname, 'preload.js'), // conecta o preload que define a ponte segura entre main e renderer
            contextIsolation: true,
            nodeIntegration: false,
            sandbox: true
        }
    });

    // Define o menu personalizado da aplicação
    Menu.setApplicationMenu(Menu.buildFromTemplate(template));

    // Carrega a tela inicial (index.html)
    win.loadFile(path.join('./src/views/index.html'));
}

// Handler pra fornecer a lista de usuários ao processo de renderer
ipcMain.handle('get-usuarios', () => {
    return getUsuarios();
});

// Handler pra salvar a lista de usuários recebida do front
ipcMain.handle('set-usuarios', (event, usuarios) => {
    setUsuarios(usuarios);
});

// Quando o Electron estiver pronto, criamos a janela
app.whenReady().then(() => {
    createWindow();

    // Exemplo de uma caixa de mensagem que aparece assim que o app abre
    const { dialog } = require('electron');
    dialog.showMessageBox({
        type: 'info',
        title: 'Aviso',
        message: 'Operação concluída com sucesso!'
    });

    // Se o app for reaberto (ex: clicando no ícone do dock no macOS)
    app.on('activate', function () {
        if (BrowserWindow.getAllWindows().length === 0) createWindow();
    });
});

// Quando o front envia um pedido pra ir pro chat, a gente carrega a página do chat
ipcMain.on('ir-para-chat', () => {
    win.loadFile(path.join(__dirname, 'src', 'views', 'chat.html'));
});

// Fecha a aplicação quando todas as janelas forem fechadas (menos no macOS)
app.on('window-all-closed', function () {
    if (process.platform !== 'darwin') app.quit();
});

// Handler que chama a função do Gemini pra gerar uma resposta a partir da pergunta
ipcMain.handle('gerar-resposta', async (event, mensagem) => {
    return await obterRespostaGemini(mensagem);
});

// Aqui definimos o menu superior da aplicação
// Tem opções como sair, recarregar, abrir ferramentas de desenvolvedor, zoom e ajuda
const template = [
    {
        label: 'Arquivo',
        submenu: [
            {
                label: 'Sair',
                click: () => app.quit(),
                accelerator: 'Alt+F4'
            }
        ]
    },
    {
        label: 'Exibir',
        submenu: [
            {
                label: 'Recarregar',
                role: 'reload'
            },
            {
                label: 'Ferramentas do Desenvolvedor',
                role: 'toggleDevTools'
            },
            {
                type: 'separator'
            },
            {
                label: 'Aplicar Zoom',
                role: 'zoomIn'
            },
            {
                label: 'Reduzir',
                role: 'zoomOut'
            },
            {
                label: 'Restaurar o Zoom Padrão',
                role: 'resetZoom'
            }
        ]
    },
    {
        label: 'Ajuda',
        submenu: [
            {
                label: 'Docs',
                click: () => shell.openExternal('https://www.electronjs.org/pt/docs/latest/')
            }
        ]
    }
];