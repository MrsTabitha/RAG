const { app, BrowserWindow, ipcMain, nativeTheme, Menu, shell, } = require('electron');
const path = require('path');
const { getUsuarios, setUsuarios } = require('./userStorage');


//Aqui estamos criando a janela
function createWindow() {
    nativeTheme.themeSource = 'light'
    const win = new BrowserWindow({
        width: 1000,
        height: 800,
        icon: './src/public/img/icone.png',
        webPreferences: {
            preload: path.join(__dirname, 'preload.js'),
            contextIsolation: true,
            nodeIntegration: false,
            sandbox: true
        }
    })
    Menu.setApplicationMenu(Menu.buildFromTemplate(template))

    win.loadFile(path.join('./src/views/index.html'));
}

// Handlers para gerenciar usuários
ipcMain.handle('get-usuarios', () => {
    return getUsuarios();
});

ipcMain.handle('set-usuarios', (event, usuarios) => {
    setUsuarios(usuarios);
});

app.whenReady().then(() => {
    createWindow();

    // Exemplo de uso correto do dialog após o app estar pronto
    const { dialog } = require('electron');
    dialog.showMessageBox({
        type: 'info',
        title: 'Aviso',
        message: 'Operação concluída com sucesso!'
    });

    app.on('activate', function () {
        if (BrowserWindow.getAllWindows().length === 0) createWindow();
    });
});

app.on('window-all-closed', function () {
    if (process.platform !== 'darwin') app.quit();
});

// Template do Menu
const template = [
    {
        label: 'Arquivo',
        submenu: [
            {
                label: 'Janela Secundária',
                click: () => childWindow()
            },
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
            },
            {
                type: 'separator'
            },
            {
                label: 'Sobre',
                click: () => aboutWindow()
            }
        ]
    }
]