document.addEventListener("DOMContentLoaded", () => {
  // Recupera nome e turma do localStorage, se já estiverem salvos
  const nome = localStorage.getItem("nomeAluno");
  const turma = localStorage.getItem("turmaAluno");

  // Se já houver dados salvos, redireciona automaticamente para a página da raspadinha
  if (nome && turma) {
    window.location.href = "raspadinha.html";
  }

  // Adiciona evento de envio ao formulário de login
  document.getElementById("loginForm").addEventListener("submit", (e) => {
    e.preventDefault(); // Impede o envio padrão do formulário (recarregar a página)

    // Obtém os valores digitados pelo usuário, removendo espaços extras
    const nome = document.getElementById("nome").value.trim();
    const turma = document.getElementById("turma").value.trim();

    // Verifica se ambos os campos foram preenchidos
    if (nome && turma) {
      // Salva os dados no localStorage para uso posterior
      localStorage.setItem("nomeAluno", nome);
      localStorage.setItem("turmaAluno", turma);

      // Redireciona para a página principal do jogo
      window.location.href = "raspadinha.html";
    } else {
      // Alerta caso algum campo esteja vazio
      alert("Por favor, preencha todos os campos.");
    }
  });
});
