// Array de objetos com as faixas de altura, classificação e ação recomendada
const faixasClassificacao = [
  {
    min: 0,
    max: 10,
    classe: "Normal",
    cssClass: "normal",
    acao: "Nenhuma ação necessária.",
  },
  {
    min: 11,
    max: 20,
    classe: "Atenção",
    cssClass: "atencao",
    acao: "Agendar inspeção nos próximos 10 dias.",
  },
  {
    min: 21,
    max: 29,
    classe: "Risco",
    cssClass: "risco",
    acao: "Programar roçagem/corte no prazo máximo de 7 dias.",
  },
  {
    min: 30,
    max: Infinity,
    classe: "Crítico",
    cssClass: "critico",
    acao: "Intervenção imediata: risco à visibilidade e segurança na via.",
  },
];

// Array de objetos com os pontos monitorados ao longo da rodovia
const pontosMonitorados = [
  { localizacao: "Km 12 - Rodovia BR-101 (Norte)", altura: 5 },
  { localizacao: "Km 25 - Rodovia BR-101 (Sul)", altura: 15 },
  { localizacao: "Km 40 - Acesso Marginal", altura: 22 },
  { localizacao: "Km 58 - Trevo de Acesso", altura: 26 },
  { localizacao: "Km 73 - Rodovia SP-330", altura: 30 },
  { localizacao: "Km 90 - Ponte Rio Verde", altura: 35 },
];

// Função para classificar a vegetação
function classificarVegetacao(altura) {
  for (let i = 0; i < faixasClassificacao.length; i++) {
    const faixa = faixasClassificacao[i];
    if (altura >= faixa.min && altura <= faixa.max) {
      return faixa;
    }
  }

  return {
    classe: "Não classificado",
    cssClass: "desconhecido",
    acao: "Verificar dado de altura informado.",
  };
}


// Função para criar o Dashboard
function renderizarDashboard() {
  const tabela = document.getElementById("corpoTabelaMonitoramento");

  // Limpa o conteúdo atual antes de reconstruir (atualização dinâmica)
  tabela.innerHTML = "";

  pontosMonitorados.forEach(function (ponto) {
    const resultado = classificarVegetacao(ponto.altura);

    // Cria a linha da tabela dinamicamente
    const linha = document.createElement("tr");
    linha.classList.add(resultado.cssClass);

    linha.innerHTML = `
            <td>${ponto.localizacao}</td>
            <td>${ponto.altura} cm</td>
            <td><span class="badge ${resultado.cssClass}">${resultado.classe}</span></td>
            <td>${resultado.acao}</td>
        `;

    tabela.appendChild(linha);
  });

  atualizarResumo();
}

// Função para gerar uma contagem por nível de risco e exibir no topo do dashboard.
function atualizarResumo() {
  const resumo = document.getElementById("resumoMonitoramento");
  resumo.innerHTML = "";

  // Conta quantos pontos existem em cada classificação
  const contagem = {};
  faixasClassificacao.forEach(function (faixa) {
    contagem[faixa.classe] = 0;
  });

  pontosMonitorados.forEach(function (ponto) {
    const resultado = classificarVegetacao(ponto.altura);
    contagem[resultado.classe] = (contagem[resultado.classe] || 0) + 1;
  });

  faixasClassificacao.forEach(function (faixa) {
    const card = document.createElement("div");
    card.classList.add("cardResumo", faixa.cssClass);
    card.innerHTML = `
            <h3>${contagem[faixa.classe] || 0}</h3>
            <p>${faixa.classe}</p>
        `;
    resumo.appendChild(card);
  });
}

// Função para cadastrar um novo ponto de monitoramento via formulário
function cadastrarPontoMonitorado(event) {
  event.preventDefault();

  const localizacaoInput = document.getElementById("localizacaoPonto");
  const alturaInput = document.getElementById("alturaPonto");

  const novoPonto = {
    localizacao: localizacaoInput.value.trim(),
    altura: parseFloat(alturaInput.value),
  };

  if (!novoPonto.localizacao || isNaN(novoPonto.altura)) {
    alert("Por favor, preencha a localização e a altura corretamente.");
    return;
  }

  pontosMonitorados.push(novoPonto);
  renderizarDashboard();

  localizacaoInput.value = "";
  alturaInput.value = "";
}

// Inicializa o dashboard quando a página carrega
document.addEventListener("DOMContentLoaded", function () {
  renderizarDashboard();

  const formMonitoramento = document.getElementById("formMonitoramento");
  if (formMonitoramento) {
    formMonitoramento.addEventListener("submit", cadastrarPontoMonitorado);
  }
});
