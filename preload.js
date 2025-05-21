const { contextBridge, ipcRenderer } = require('electron');

// Essa parte aqui é pra expor uma interface segura entre o processo principal e o renderizador.
// A ideia é que o front (HTML/JS) só consiga acessar essas funções específicas, e nada além disso.
contextBridge.exposeInMainWorld('api', {

    // Recupera os usuários armazenados, chamando o canal 'get-usuarios' lá do processo principal.
    getUsuarios: () => ipcRenderer.invoke('get-usuarios'),

    // Salva os dados dos usuários, passando os dados pelo canal 'set-usuarios'.
    setUsuarios: (usuarios) => ipcRenderer.invoke('set-usuarios', usuarios),

    // Envia um sinal para mudar a tela para o chat. Não espera resposta, só dispara o evento.
    redirecionarParaChat: () => ipcRenderer.send('ir-para-chat'),

    // Envia uma mensagem para o Gemini gerar uma resposta, e espera essa resposta de volta.
    gerarResposta: (mensagem) => ipcRenderer.invoke('gerar-resposta', mensagem),
});

