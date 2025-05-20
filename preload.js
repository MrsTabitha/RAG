const { contextBridge, ipcRenderer } = require('electron');

// Expor funções seguras para o processo de renderização
contextBridge.exposeInMainWorld('api', {
    getUsuarios: () => ipcRenderer.invoke('get-usuarios'),
    setUsuarios: (usuarios) => ipcRenderer.invoke('set-usuarios', usuarios),
    redirecionarParaDashboard: () => ipcRenderer.send('ir-para-dashboard')
});

// Pré-carregamento opcional para comunicação segura, vazio por enquanto.