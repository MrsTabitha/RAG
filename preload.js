const { contextBridge, ipcRenderer } = require('electron');

// Expor funções seguras para o processo de renderização
contextBridge.exposeInMainWorld('api', {
  getComidaInfo: (comida) => ipcRenderer.invoke('get-comida-info', comida),
  getUsuarios: () => ipcRenderer.invoke('get-usuarios'),
  setUsuarios: (usuarios) => ipcRenderer.invoke('set-usuarios', usuarios)
});

// Pré-carregamento opcional para comunicação segura, vazio por enquanto.