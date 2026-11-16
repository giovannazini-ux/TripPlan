const moeda = new Intl.NumberFormat("pt-BR", { style: "currency", currency: "BRL" });

const colecoes = {
    viagens: {
        chave: "id_viagem",
        titulo: viagem => viagem.nome,
        detalhes: viagem => [
            ["Destino", viagem.destino],
            ["Ida", formatarData(viagem.data_ida)],
            ["Volta", formatarData(viagem.data_volta)],
            ["Orçamento", moeda.format(viagem.orcamento)],
            ["Total gasto", moeda.format(viagem.total_despesas)],
            ["Saldo", moeda.format(viagem.orcamento - viagem.total_despesas)]
        ]
    },
    destinos: {
        chave: "id_destino",
        titulo: destino => destino.cidade + ", " + destino.pais,
        detalhes: destino => [
            ["Viagem", destino.nome_viagem],
            ["Descrição", destino.descricao]
        ]
    },
    passeios: {
        chave: "id_passeio",
        titulo: passeio => passeio.nome,
        detalhes: passeio => [
            ["Data", formatarData(passeio.data)],
            ["Viagem", passeio.nome_viagem],
            ["Descrição", passeio.descricao]
        ]
    },
    despesas: {
        chave: "id_despesa",
        titulo: despesa => despesa.descricao,
        detalhes: despesa => [
            ["Categoria", despesa.categoria],
            ["Valor", moeda.format(despesa.valor)],
            ["Viagem", despesa.nome_viagem]
        ]
    }
};

function formatarData(data) {
    return data.split("-").reverse().join("/");
}

async function requisitar(colecao, metodo = "GET", id = null, dados = null) {
    const rota = document.body.dataset.api + "/" + colecao + (id === null ? "" : "/" + id);
    const opcoes = { method: metodo };
    if (dados !== null) {
        opcoes.headers = { "Content-Type": "application/json" };
        opcoes.body = JSON.stringify(dados);
    }

    let resposta;
    try {
        resposta = await fetch(rota, opcoes);
    } catch {
        throw new Error("Não foi possível conectar ao TripPlan.");
    }
    const resultado = await resposta.json().catch(() => null);
    if (!resposta.ok || resultado === null) {
        throw new Error(resultado?.erro || "O TripPlan retornou uma resposta inesperada.");
    }
    return resultado;
}

function criarBotao(texto, classe, acao) {
    const botao = document.createElement("button");
    botao.type = "button";
    botao.className = classe;
    botao.textContent = texto;
    botao.addEventListener("click", acao);
    return botao;
}

function mostrarMensagem(area, mensagem, erro = false) {
    area.textContent = mensagem;
    area.toggleAttribute("data-erro", erro);
}

function iniciarCadastros(formulario) {
    const colecao = formulario.dataset.colecao;
    const { chave, titulo, detalhes } = colecoes[colecao];
    const cabecalho = document.getElementById("titulo-formulario");
    const botaoSalvar = formulario.querySelector('button[type="submit"]');
    const botaoCancelar = document.getElementById("cancelar-edicao");
    const seletorViagem = formulario.elements.namedItem("id_viagem");
    const mensagemFormulario = document.getElementById("mensagem-formulario");
    const lista = document.getElementById("registros");
    const estadoLista = document.getElementById("estado-lista");
    let idEdicao = null;
    let ocupado = false;
    let podeSalvar = false;

    function atualizarBotao() {
        botaoSalvar.disabled = ocupado || !podeSalvar;
    }

    function limparEdicao() {
        idEdicao = null;
        formulario.reset();
        cabecalho.textContent = cabecalho.dataset.novo;
        botaoSalvar.textContent = botaoSalvar.dataset.cadastrar;
        botaoCancelar.hidden = true;
    }

    function abrirEdicao(registro) {
        if (ocupado) return;
        idEdicao = registro[chave];
        for (const campo of formulario.elements) {
            if (!campo.name) continue;
            const valor = String(registro[campo.name] ?? "");
            if (campo.name === "categoria" && !Array.from(campo.options).some(opcao => opcao.value === valor)) {
                campo.add(new Option(valor, valor));
            }
            campo.value = valor;
        }
        cabecalho.textContent = cabecalho.dataset.edicao;
        botaoSalvar.textContent = "Salvar alterações";
        botaoCancelar.hidden = false;
        mostrarMensagem(mensagemFormulario, "");
        formulario.querySelector("input, select, textarea").focus();
    }

    function criarCartao(registro) {
        const cartao = document.createElement("article");
        cartao.className = "card-viagem";
        const nome = document.createElement("h3");
        nome.textContent = titulo(registro);
        cartao.append(nome);
        for (const [rotulo, valor] of detalhes(registro)) {
            if (!valor) continue;
            const linha = document.createElement("p");
            linha.textContent = rotulo + ": " + valor;
            cartao.append(linha);
        }
        const acoes = document.createElement("div");
        acoes.className = "acoes-registro";
        const mensagemCartao = document.createElement("p");
        mensagemCartao.className = "status-form";
        mensagemCartao.setAttribute("role", "status");
        const editar = criarBotao("Editar", "botao-acao", () => abrirEdicao(registro));
        const excluir = criarBotao("Excluir", "botao-acao botao-excluir", () => {
            if (!ocupado && window.confirm('Excluir "' + nome.textContent + '"?')) {
                alterar("DELETE", registro[chave], null, mensagemCartao);
            }
        });
        acoes.append(editar, excluir);
        cartao.append(acoes, mensagemCartao);
        return cartao;
    }

    async function atualizar() {
        const [registros, viagens] = await Promise.all([
            requisitar(colecao),
            seletorViagem ? requisitar("viagens") : null
        ]);

        if (seletorViagem) {
            const selecionada = seletorViagem.value;
            seletorViagem.replaceChildren(new Option("Selecione uma viagem", ""));
            for (const viagem of viagens) {
                seletorViagem.add(new Option(viagem.nome, viagem.id_viagem));
            }
            if (viagens.some(viagem => String(viagem.id_viagem) === selecionada)) {
                seletorViagem.value = selecionada;
            }
            seletorViagem.disabled = viagens.length === 0;
            document.getElementById("aviso-sem-viagem").hidden = viagens.length > 0;
        }
        podeSalvar = !seletorViagem || viagens.length > 0;
        lista.replaceChildren(...registros.map(criarCartao));
        estadoLista.textContent = estadoLista.dataset.vazio;
        estadoLista.hidden = registros.length > 0;
        atualizarBotao();
    }

    async function alterar(metodo, id, dados, area = mensagemFormulario) {
        ocupado = true;
        atualizarBotao();
        mostrarMensagem(area, "");
        try {
            const resultado = await requisitar(colecao, metodo, id, dados);
            if (metodo !== "DELETE" || id === idEdicao) limparEdicao();
            mostrarMensagem(area, resultado.mensagem);
            try {
                await atualizar();
            } catch {
                mostrarMensagem(area, resultado.mensagem + " Recarregue a página para atualizar a lista.", true);
            }
        } catch (erro) {
            mostrarMensagem(area, erro.message, true);
        } finally {
            ocupado = false;
            atualizarBotao();
        }
    }

    botaoCancelar.addEventListener("click", () => {
        if (!ocupado) {
            limparEdicao();
            mostrarMensagem(mensagemFormulario, "");
            formulario.querySelector("input, select, textarea").focus();
        }
    });

    formulario.addEventListener("submit", evento => {
        evento.preventDefault();
        if (ocupado || !podeSalvar) return;
        const dados = Object.fromEntries(new FormData(formulario));
        const campoVazio = Array.from(formulario.elements).find(campo => campo.required && !campo.value.trim());
        if (campoVazio) {
            mostrarMensagem(mensagemFormulario, "Preencha todos os campos obrigatórios.", true);
            campoVazio.focus();
            return;
        }
        if (colecao === "viagens" && dados.data_volta < dados.data_ida) {
            mostrarMensagem(mensagemFormulario, "A data de volta deve ser igual ou posterior à data de ida.", true);
            formulario.elements.namedItem("data_volta").focus();
            return;
        }
        alterar(idEdicao === null ? "POST" : "PUT", idEdicao, dados);
    });

    atualizar().catch(erro => {
        mostrarMensagem(estadoLista, erro.message, true);
    });
}

function iniciarExplorar() {
    const cartoes = Array.from(document.querySelectorAll(".destino-card"));
    const filtros = document.querySelectorAll(".categoria-card");
    const pesquisa = document.getElementById("pesquisaDestino");
    const mensagem = document.getElementById("mensagemDestino");
    let categoria = "";

    function normalizar(texto) {
        return texto.toLowerCase().normalize("NFD").replace(/\p{Diacritic}/gu, "").trim();
    }

    function atualizarResultados() {
        const termo = normalizar(pesquisa.value);
        for (const cartao of cartoes) {
            const combinaCategoria = !categoria || cartao.dataset.categoria === categoria;
            cartao.hidden = !combinaCategoria || !normalizar(cartao.textContent).includes(termo);
        }
        for (const filtro of filtros) {
            const selecionado = filtro.dataset.categoria === categoria;
            filtro.classList.toggle("selecionada", selecionado);
            filtro.setAttribute("aria-pressed", String(selecionado));
        }
        mensagem.textContent = cartoes.every(cartao => cartao.hidden) ? "Nenhum destino encontrado." : "";
    }

    filtros.forEach(filtro => {
        filtro.addEventListener("click", () => {
            categoria = filtro.dataset.categoria === categoria ? "" : filtro.dataset.categoria;
            atualizarResultados();
        });
    });
    pesquisa.addEventListener("input", atualizarResultados);
    document.getElementById("mostrarTodos").addEventListener("click", () => {
        categoria = "";
        pesquisa.value = "";
        atualizarResultados();
    });
    document.getElementById("surpreendaMe").addEventListener("click", () => {
        const visiveis = cartoes.filter(cartao => !cartao.hidden);
        if (!visiveis.length) return;
        const sorteado = visiveis[Math.floor(Math.random() * visiveis.length)];
        mensagem.textContent = "Que tal conhecer " + sorteado.querySelector("h3").textContent + "?";
        sorteado.scrollIntoView({ behavior: "smooth", block: "center" });
    });
}

const formulario = document.getElementById("formulario-registro");
if (formulario) iniciarCadastros(formulario);
if (document.getElementById("pesquisaDestino")) iniciarExplorar();
