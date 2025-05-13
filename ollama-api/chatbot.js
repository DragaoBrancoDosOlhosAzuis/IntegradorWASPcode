let messageCount = 0;
let isProcessing = false; // Controla se o bot está respondendo

async function enviarMensagem() {
  // Se já estiver processando, não faz nada
  if (isProcessing) return;
  
  const input = document.querySelector("input");
  const sendButton = document.getElementById("sendButton");
  const mensagem = input.value.trim();
  const respostaContainer = document.getElementById("chatbotContent");

  // Verificação de mensagem vazia
  if (!mensagem) {
    let erro = document.getElementById("errorMessage");
    if (!erro) {
      erro = document.createElement("div");
      erro.id = "errorMessage";
      erro.style.color = "red";
      respostaContainer.appendChild(erro);
    }
    erro.textContent = "Por favor, digite uma mensagem!";
    return;
  }

  // Marca como processando e desabilita inputs
  isProcessing = true;
  input.disabled = true;
  sendButton.disabled = true;

  // Limpa mensagens de erro anteriores
  const erro = document.getElementById("errorMessage");
  if (erro) erro.remove();

  // Adiciona mensagem do usuário
  const userMessage = document.createElement("div");
  userMessage.classList.add("message", "user-message");
  userMessage.textContent = mensagem;
  respostaContainer.appendChild(userMessage);

  // Adiciona placeholder de resposta
  const botMessage = document.createElement("div");
  botMessage.classList.add("message", "bot-message");
  botMessage.id = `botResponse-${messageCount}`;
  botMessage.textContent = "Digitando...";
  respostaContainer.appendChild(botMessage);

  respostaContainer.scrollTop = respostaContainer.scrollHeight;
  messageCount++;
  input.value = "";

  // Contexto do chatbot
  const contexto = `
Você é o WaspBot, assistente virtual inteligente da biblioteca do CFP-Paraíso. Seu papel é ajudar usuários e bibliotecários com todas as operações relacionadas ao sistema de gerenciamento da biblioteca.

INFORMAÇÕES INSTITUCIONAIS:
- Nome: Centro de Formação Profissional Paraíso (CFP-Paraíso)
- Tipo: Biblioteca escolar técnica e profissionalizante
- Público-alvo: Alunos, professores e funcionários

SERVIÇOS DA BIBLIOTECA:
1. Empréstimo de livros (15 dias, renovável uma vez)
2. Reserva de materiais indisponíveis
3. Acesso a computadores para pesquisa
4. Orientação bibliográfica
5. Espaço de estudo individual e em grupo

CATÁLOGO COMPLETO (Atualizado em 2023):
- LIVROS TÉCNICOS/PROFISSIONALIZANTES:
  "Administração Financeira e Orçamentária" (disponível)
  "Excel Avançado para Engenharia" (disponível)
  "Logística e Cadeia de Suprimentos" (disponível)
  "Desenho Técnico Mecânico" (emprestado até 25/05)
  "Eletrônica Básica - Vol. 2" (em manutenção)

- LITERATURA:
  "O Homem de Giz" (disponível)
  "Dom Casmurro" (3 cópias disponíveis)
  "1984" (disponível)
  "A Revolução dos Bichos" (emprestado até 20/05)
  "O Pequeno Príncipe" (2 cópias disponíveis)

- PERIÓDICOS/REVISTAS:
  "Revista Tecnológica - Ed. 45" (disponível na biblioteca)
  "Scientific American - Abril 2023" (disponível)
  "Veja - Coleção 2022" (consulta local apenas)

- NOVAS AQUISIÇÕES (2023):
  "Inteligência Artificial para Iniciantes"
  "Gestão de Projetos Ágeis"
  "Python para Data Science"
  "O Milagre da Manhã" (2 cópias)
  "Mindset - A Nova Psicologia do Sucesso"

POLÍTICAS E REGRAS:
1. Empréstimo: 3 itens simultâneos por 15 dias
2. Renovação: Permitida 1 vez se não houver reservas
3. Multa: R$ 2,00/dia de atraso por item
4. Reservas: Mantidas por 48h após disponibilidade
5. Perda/dano: Usuário responsável pela reposição

HORÁRIO DE FUNCIONAMENTO:
- Segunda a sexta: 7h30 às 19h (ininterrupto)
- Sábados: 8h às 12h (período letivo)
- Feriados: Fechado

FUNCIONALIDADES DO SISTEMA QUE VOCÊ PODE EXPLICAR:
- Como reservar livros
- Consultar prazos de devolução
- Renovar empréstimos
- Pagar multas online
- Sugerir novas aquisições
- Acessar o catálogo digital
- Reportar problemas com materiais

INSTRUÇÕES PARA O WaspBot:
1. Seja prestativo e educado, mas objetivo
2. Forneça informações precisas sobre disponibilidade
3. Para perguntas administrativas complexas, oriente a procurar o balcão de atendimento
4. Mantenha respostas curtas (máximo 3 parágrafos)
5. Destaque informações importantes em negrito quando relevante

Responda à seguinte pergunta do usuário considerando TODAS essas informações, mas de forma natural, sem listar todo o contexto:

Usuário: "${mensagem}"
Resposta:
`;

  try {
    const response = await fetch("http://localhost:7000/api/ia", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ text: contexto })
    });

    const data = await response.text();

    try {
      const json = JSON.parse(data);
      botMessage.textContent = json.response || "Desculpe, não consegui entender. Pode tentar de outro jeito?";
    } catch {
      botMessage.textContent = data || "Não consegui processar sua pergunta.";
    }

  } catch (error) {
    botMessage.textContent = "Erro ao tentar responder. Tente novamente em instantes.";
    console.error("Erro ao enviar mensagem:", error);
  } finally {
    // Reabilita os controles independente de sucesso ou erro
    isProcessing = false;
    input.disabled = false;
    sendButton.disabled = false;
    input.focus();
    respostaContainer.scrollTop = respostaContainer.scrollHeight;
  }
}

// Evento de tecla com debounce
let debounceTimer;
document.querySelector("input").addEventListener("keypress", function (e) {
  if (e.key === "Enter") {
    clearTimeout(debounceTimer);
    debounceTimer = setTimeout(() => {
      enviarMensagem();
    }, 200);
  }
});

// Evento de clique no botão de enviar
document.getElementById("sendButton").addEventListener("click", function() {
  enviarMensagem();
});
