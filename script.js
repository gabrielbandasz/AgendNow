document.addEventListener("DOMContentLoaded", () => {
  // Recupera os dados do aluno armazenados no localStorage
  const nome = localStorage.getItem("nomeAluno");
  const turma = localStorage.getItem("turmaAluno");

  // Se nome ou turma não estiverem disponíveis, redireciona para a página inicial
  if (!nome || !turma) {
    window.location.href = "index.html";
    return;
  }

  // Seleciona elementos do DOM
  const container = document.querySelector(".container");
  const raspadinhasContainer = document.getElementById("raspadinhas");
  const mensagemFinal = document.getElementById("mensagemFinal");

  // Cria saudação personalizada e insere antes das raspadinhas
  const saudacao = document.createElement("h2");
  saudacao.textContent = `Olá, ${nome} da turma ${turma}! Escolha uma raspadinha:`;
  container.insertBefore(saudacao, raspadinhasContainer);

  // Lista de possíveis prêmios ou "perda"
  const simbolos = [
    "🎁 Camiseta da escola", "🖊️ Caneta personalizada", "❌ VOCÊ PERDEU",
    "📚 10% na matrícula", "🍭 Kit de doces", "🥤 Copo personalizado",
    "🎧 Fones de ouvido", "🍎 Lanche especial"
  ];

  // Número máximo de tentativas permitidas
  const MAX_TENTATIVAS = 3;
  let tentativasFeitas = 0;
  const raspadinhas = [];

  // Carrega os sons de vitória e derrota
  const somVitoria = new Audio("sons/victorymale-version-230553.mp3");
  const somDerrota = new Audio("sons/game_over.mp3");

  // Gera 3 raspadinhas com prêmios aleatórios
  for (let i = 0; i < MAX_TENTATIVAS; i++) {
    const simboloAleatorio = simbolos[Math.floor(Math.random() * simbolos.length)];
    raspadinhas.push(simboloAleatorio);
  }

  // Função que cria o elemento visual da raspadinha e sua lógica
  function criarRaspadinha(simbolo, index) {
    const div = document.createElement("div");
    div.classList.add("raspadinha");
    div.setAttribute("role", "listitem");
    div.setAttribute("tabindex", "0");
    div.setAttribute("aria-label", `Raspadinha ${index + 1}`);

    // Exibe o prêmio (inicialmente oculto pelo canvas)
    const premioDiv = document.createElement("div");
    premioDiv.classList.add("premio");
    premioDiv.textContent = simbolo;
    div.appendChild(premioDiv);

    // Cria o canvas que simula a parte raspável
    const canvas = document.createElement("canvas");
    canvas.width = 140;
    canvas.height = 120;
    div.appendChild(canvas);
    raspadinhasContainer.appendChild(div);

    const ctx = canvas.getContext("2d");
    ctx.fillStyle = "#C0C0C0"; // cor prata, como raspadinha real
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    let isDrawing = false;
    let raspada = false;

    // Função que desenha a "raspagem" apagando a área tocada
    function desenhar(e) {
      if (!isDrawing) return;

      const rect = canvas.getBoundingClientRect();
      const clientX = e.clientX ?? e.touches?.[0]?.clientX;
      const clientY = e.clientY ?? e.touches?.[0]?.clientY;
      if (clientX === undefined || clientY === undefined) return;

      const x = clientX - rect.left;
      const y = clientY - rect.top;

      // Altera a operação para apagar a parte do canvas
      ctx.globalCompositeOperation = "destination-out";
      ctx.beginPath();
      ctx.arc(x, y, 15, 0, Math.PI * 2, false);
      ctx.fill();
    }

    // Função que calcula se a raspagem foi suficiente (>50% apagado)
    function processarRaspagem() {
      if (raspada) return;

      const imgData = ctx.getImageData(0, 0, canvas.width, canvas.height);
      let pixelsTransparente = 0;

      // Verifica quantos pixels estão com alpha = 0 (transparentes)
      for (let i = 3; i < imgData.data.length; i += 4) {
        if (imgData.data[i] === 0) pixelsTransparente++;
      }

      const totalPixels = canvas.width * canvas.height;
      const porcentagemTransparente = (pixelsTransparente / totalPixels) * 100;

      if (porcentagemTransparente > 50) {
        raspada = true;
        tentativasFeitas++;
        canvas.remove(); // Remove canvas para mostrar prêmio
        div.classList.add("raspada"); // Aplica estilo visual
        atualizarMensagem();

        if (tentativasFeitas === MAX_TENTATIVAS) {
          verificarResultado();
        }
      }
    }

    // Eventos para mouse
    canvas.addEventListener("mousedown", () => {
      if (raspada) return;
      isDrawing = true;
    });

    canvas.addEventListener("mouseup", () => {
      if (!isDrawing) return;
      isDrawing = false;
      processarRaspagem();
    });

    canvas.addEventListener("mousemove", desenhar);

    // Eventos para toque (mobile)
    canvas.addEventListener("touchstart", (e) => {
      e.preventDefault();
      if (raspada) return;
      isDrawing = true;
    }, { passive: false });

    canvas.addEventListener("touchend", () => {
      if (!isDrawing) return;
      isDrawing = false;
      processarRaspagem();
    });

    canvas.addEventListener("touchmove", (e) => {
      e.preventDefault();
      desenhar(e);
    }, { passive: false });
  }

  // Atualiza mensagem informando tentativas restantes
  function atualizarMensagem() {
    const restantes = MAX_TENTATIVAS - tentativasFeitas;
    mensagemFinal.textContent = restantes > 0
      ? `Você tem ${restantes} raspadinha${restantes > 1 ? 's' : ''} restante${restantes > 1 ? 's' : ''}.`
      : "⚠️ Você esgotou suas tentativas! Volte amanhã.";
  }

  // Verifica se o jogador ganhou (3 prêmios iguais)
  function verificarResultado() {
    const primeiraRaspadinha = raspadinhas[0];
    const ganhou = raspadinhas.every(s => s === primeiraRaspadinha);

    if (ganhou) {
      somVitoria.play(); // Reproduz som de vitória
      mensagemFinal.textContent = `🎉 Parabéns! Você ganhou 3x "${primeiraRaspadinha}"!`;
    } else {
      somDerrota.play(); // Reproduz som de derrota
      mensagemFinal.textContent = "😞 Não foi dessa vez. Tente novamente amanhã!";
    }

    // Desativa todas as raspadinhas (para impedir mais interações)
    document.querySelectorAll(".raspadinha").forEach(div => div.classList.add("desativada"));
  }

  // Cria as raspadinhas com base nos símbolos gerados
  raspadinhas.forEach((simbolo, idx) => criarRaspadinha(simbolo, idx));

  // Botão de sair - limpa os dados e volta para a tela inicial
  document.getElementById("sairBtn").addEventListener("click", () => {
    localStorage.removeItem("nomeAluno");
    localStorage.removeItem("turmaAluno");
    window.location.href = "index.html";
  });

  // ===== MODO CLARO / ESCURO =====

  const toggleThemeBtn = document.getElementById("toggle-theme");
  const body = document.body;
  const temaSalvo = localStorage.getItem("tema") || "claro";

  // Aplica o tema salvo no body
  function aplicarTema(tema) {
    if (tema === "escuro") {
      body.classList.add("dark");
      body.classList.remove("light");
      toggleThemeBtn.textContent = "☀️"; // Sol para indicar luz
    } else {
      body.classList.add("light");
      body.classList.remove("dark");
      toggleThemeBtn.textContent = "🌙"; // Lua para indicar noite
    }
    localStorage.setItem("tema", tema); // Salva tema escolhido
  }

  // Aplica o tema assim que a página é carregada
  aplicarTema(temaSalvo);

  // Alterna entre claro e escuro ao clicar no botão
  toggleThemeBtn.addEventListener("click", () => {
    const temaAtual = body.classList.contains("dark") ? "escuro" : "claro";
    const novoTema = temaAtual === "escuro" ? "claro" : "escuro";
    aplicarTema(novoTema);
  });
});
