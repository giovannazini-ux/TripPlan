
const formularioViagem = document.getElementById("formViagem");
const formularioDestino = document.getElementById("formDestino");
const formularioPasseio = document.getElementById("formPasseio");
const formularioDespesa = document.getElementById("formDespesa");

async function carregarViagens() {
    const lista = document.querySelector(".lista-viagens");

    if (!lista || !formularioViagem) return;

    try {
        const resposta = await fetch("/api/viagens");
        const viagens = await resposta.json();

        lista.innerHTML = `
            <div class="lista-titulo">
                <div>
                    <span class="etiqueta">SEUS PLANOS</span>
                    <h2>Viagens cadastradas</h2>
                </div>
            </div>
        `;

        if (viagens.length === 0) {
            lista.innerHTML += `
                <div class="vazio">
                    <span class="icone-vazio">✈</span>
                    <h3>Nenhuma viagem cadastrada</h3>
                    <p>Suas próximas aventuras aparecerão aqui.</p>
                </div>
            `;
            return;
        }

        viagens.forEach(viagem => {
            const card = document.createElement("div");
            card.className = "card-viagem";

            const titulo = document.createElement("h3");
            titulo.textContent = viagem.nome;

            const destino = document.createElement("p");
            destino.textContent = "Destino: " + viagem.destino;

            const ida = document.createElement("p");
            ida.textContent = "Ida: " + viagem.data_ida;

            const volta = document.createElement("p");
            volta.textContent = "Volta: " + viagem.data_volta;

            const orcamento = document.createElement("p");
            orcamento.textContent = "Orçamento: R$ " +
                Number(viagem.orcamento).toFixed(2);

            card.append(titulo, destino, ida, volta, orcamento);
            lista.appendChild(card);
        });

    } catch (erro) {
        alert("Não foi possível carregar as viagens.");
    }
}

if (formularioViagem) {
    formularioViagem.addEventListener("submit", async function(event) {
        event.preventDefault();

        const dataIda = document.getElementById("data_ida").value;
        const dataVolta = document.getElementById("data_volta").value;

        if (dataVolta < dataIda) {
            alert("A data de volta não pode ser anterior à data de ida.");
            return;
        }

        const viagem = {
            nome: document.getElementById("nome").value,
            destino: document.getElementById("destino").value,
            data_ida: dataIda,
            data_volta: dataVolta,
            orcamento: document.getElementById("orcamento").value
        };

        try {
            const resposta = await fetch("/api/viagens", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify(viagem)
            });

            const resultado = await resposta.json();

            if (resposta.ok) {
                alert("Viagem cadastrada com sucesso!");
                formularioViagem.reset();
                carregarViagens();
            } else {
                alert(resultado.erro || "Erro ao cadastrar viagem.");
            }

        } catch (erro) {
            alert("Não foi possível conectar ao servidor.");
        }
    });
}


async function carregarOpcoesViagens(idSelect) {
    const select = document.getElementById(idSelect);

    if (!select) return;

    try {
        const resposta = await fetch("/api/viagens");
        const viagens = await resposta.json();

        select.innerHTML = '<option value="">Selecione uma viagem</option>';

        viagens.forEach(viagem => {
            const opcao = document.createElement("option");
            opcao.value = viagem.id_viagem;
            opcao.textContent = viagem.nome;
            select.appendChild(opcao);
        });

    } catch (erro) {
        console.error("Erro ao carregar viagens.", erro);
    }
}


async function carregarDestinos() {
    const lista = document.querySelector(".lista-viagens");

    if (!lista || !formularioDestino) return;

    try {
        const resposta = await fetch("/api/destinos");
        const destinos = await resposta.json();

        lista.innerHTML = `
            <div class="lista-titulo">
                <div>
                    <span class="etiqueta">LUGARES PLANEJADOS</span>
                    <h2>Destinos cadastrados</h2>
                </div>
            </div>
        `;

        if (destinos.length === 0) {
            lista.innerHTML += `
                <div class="vazio">
                    <h3>Nenhum destino cadastrado</h3>
                    <p>Adicione os lugares que deseja conhecer.</p>
                </div>
            `;
            return;
        }

        destinos.forEach(destino => {
            const card = document.createElement("div");
            card.className = "card-viagem";

            const titulo = document.createElement("h3");
            titulo.textContent = destino.cidade + ", " + destino.pais;

            const viagem = document.createElement("p");
            viagem.textContent = "Viagem: " + destino.nome_viagem;

            const descricao = document.createElement("p");
            descricao.textContent = "Descrição: " + (destino.descricao || "Não informada");

            card.append(titulo, viagem, descricao);
            lista.appendChild(card);
        });

    } catch (erro) {
        alert("Não foi possível carregar os destinos.");
    }
}

if (formularioDestino) {
    formularioDestino.addEventListener("submit", async function(event) {
        event.preventDefault();

        const destino = {
            cidade: document.getElementById("cidade").value,
            pais: document.getElementById("pais").value,
            id_viagem: document.getElementById("viagem").value,
            descricao: document.getElementById("descricao").value
        };

        try {
            const resposta = await fetch("/api/destinos", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify(destino)
            });

            const resultado = await resposta.json();

            if (resposta.ok) {
                alert("Destino cadastrado com sucesso!");
                formularioDestino.reset();
                carregarDestinos();
            } else {
                alert(resultado.erro || "Erro ao cadastrar destino.");
            }

        } catch (erro) {
            alert("Não foi possível conectar ao servidor.");
        }
    });
}


async function carregarPasseios() {
    const lista = document.querySelector(".lista-viagens");

    if (!lista || !formularioPasseio) return;

    try {
        const resposta = await fetch("/api/passeios");
        const passeios = await resposta.json();

        lista.innerHTML = `
            <div class="lista-titulo">
                <div>
                    <span class="etiqueta">SUAS EXPERIÊNCIAS</span>
                    <h2>Passeios cadastrados</h2>
                </div>
            </div>
        `;

        if (passeios.length === 0) {
            lista.innerHTML += `
                <div class="vazio">
                    <h3>Nenhum passeio cadastrado</h3>
                    <p>Adicione as atividades da sua viagem.</p>
                </div>
            `;
            return;
        }

        passeios.forEach(passeio => {
            const card = document.createElement("div");
            card.className = "card-viagem";

            const titulo = document.createElement("h3");
            titulo.textContent = passeio.nome;

            const data = document.createElement("p");
            data.textContent = "Data: " + passeio.data;

            const viagem = document.createElement("p");
            viagem.textContent = "Viagem: " + passeio.nome_viagem;

            const descricao = document.createElement("p");
            descricao.textContent = "Descrição: " + (passeio.descricao || "Não informada");

            card.append(titulo, data, viagem, descricao);
            lista.appendChild(card);
        });

    } catch (erro) {
        alert("Não foi possível carregar os passeios.");
    }
}

if (formularioPasseio) {
    formularioPasseio.addEventListener("submit", async function(event) {
        event.preventDefault();

        const passeio = {
            nome: document.getElementById("nomePasseio").value,
            data: document.getElementById("dataPasseio").value,
            id_viagem: document.getElementById("viagemPasseio").value,
            descricao: document.getElementById("descricaoPasseio").value
        };

        try {
            const resposta = await fetch("/api/passeios", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify(passeio)
            });

            const resultado = await resposta.json();

            if (resposta.ok) {
                alert("Passeio cadastrado com sucesso!");
                formularioPasseio.reset();
                carregarPasseios();
            } else {
                alert(resultado.erro || "Erro ao cadastrar passeio.");
            }

        } catch (erro) {
            alert("Não foi possível conectar ao servidor.");
        }
    });
}


async function carregarDespesas() {
    const lista = document.querySelector(".lista-viagens");

    if (!lista || !formularioDespesa) return;

    try {
        const resposta = await fetch("/api/despesas");
        const despesas = await resposta.json();

        lista.innerHTML = `
            <div class="lista-titulo">
                <div>
                    <span class="etiqueta">CONTROLE FINANCEIRO</span>
                    <h2>Despesas cadastradas</h2>
                </div>
            </div>
        `;

        if (despesas.length === 0) {
            lista.innerHTML += `
                <div class="vazio">
                    <h3>Nenhuma despesa cadastrada</h3>
                    <p>Registre seus gastos para acompanhar o orçamento.</p>
                </div>
            `;
            return;
        }

        despesas.forEach(despesa => {
            const card = document.createElement("div");
            card.className = "card-viagem";

            const titulo = document.createElement("h3");
            titulo.textContent = despesa.descricao;

            const categoria = document.createElement("p");
            categoria.textContent = "Categoria: " + despesa.categoria;

            const valor = document.createElement("p");
            valor.textContent = "Valor: R$ " + Number(despesa.valor).toFixed(2);

            const viagem = document.createElement("p");
            viagem.textContent = "Viagem: " + despesa.nome_viagem;

            card.append(titulo, categoria, valor, viagem);
            lista.appendChild(card);
        });

    } catch (erro) {
        alert("Não foi possível carregar as despesas.");
    }
}

if (formularioDespesa) {
    formularioDespesa.addEventListener("submit", async function(event) {
        event.preventDefault();

        const despesa = {
            descricao: document.getElementById("descricaoDespesa").value,
            categoria: document.getElementById("categoriaDespesa").value,
            valor: document.getElementById("valorDespesa").value,
            id_viagem: document.getElementById("viagemDespesa").value
        };

        try {
            const resposta = await fetch("/api/despesas", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify(despesa)
            });

            const resultado = await resposta.json();

            if (resposta.ok) {
                alert("Despesa cadastrada com sucesso!");
                formularioDespesa.reset();
                carregarDespesas();
            } else {
                alert(resultado.erro || "Erro ao cadastrar despesa.");
            }

        } catch (erro) {
            alert("Não foi possível conectar ao servidor.");
        }
    });
}


// ===== EXPLORAR DESTINOS =====

const cartoesDestino = document.querySelectorAll(".destino-card");
const botoesCategoria = document.querySelectorAll(".categoria-card");
const pesquisaDestino = document.getElementById("pesquisaDestino");
const botaoSurpresa = document.getElementById("surpreendaMe");
const botaoTodos = document.getElementById("mostrarTodos");
const mensagemDestino = document.getElementById("mensagemDestino");

let categoriaAtual = "todos";

function atualizarDestinos() {
    const pesquisa = pesquisaDestino
        ? pesquisaDestino.value.toLowerCase().trim()
        : "";

    cartoesDestino.forEach(cartao => {
        const categoria = cartao.dataset.categoria;
        const nome = cartao.textContent.toLowerCase();

        const combinaCategoria =
            categoriaAtual === "todos" || categoria === categoriaAtual;

        const combinaPesquisa = nome.includes(pesquisa);

        cartao.style.display =
            combinaCategoria && combinaPesquisa ? "block" : "none";
    });
}

botoesCategoria.forEach(botao => {
    botao.addEventListener("click", function() {
        categoriaAtual = this.dataset.categoria;

        botoesCategoria.forEach(item => {
            item.classList.remove("selecionada");
        });

        this.classList.add("selecionada");
        atualizarDestinos();
    });
});

if (pesquisaDestino) {
    pesquisaDestino.addEventListener("input", atualizarDestinos);
}

if (botaoTodos) {
    botaoTodos.addEventListener("click", function() {
        categoriaAtual = "todos";

        botoesCategoria.forEach(item => {
            item.classList.remove("selecionada");
        });

        if (pesquisaDestino) {
            pesquisaDestino.value = "";
        }

        atualizarDestinos();
    });
}

if (botaoSurpresa) {
    botaoSurpresa.addEventListener("click", function() {
        const destinosVisiveis = Array.from(cartoesDestino).filter(cartao => {
            return cartao.style.display !== "none";
        });

        if (destinosVisiveis.length === 0) {
            if (mensagemDestino) {
                mensagemDestino.textContent = "Nenhum destino encontrado para sortear.";
            }
            return;
        }

        const sorteado = destinosVisiveis[
            Math.floor(Math.random() * destinosVisiveis.length)
        ];

        if (mensagemDestino) {
            mensagemDestino.textContent =
                "Que tal conhecer " +
                sorteado.querySelector("h3").textContent + "?";
        }

        sorteado.scrollIntoView({
            behavior: "smooth",
            block: "center"
        });
    });
}


// ===== INICIALIZAÇÃO DAS PÁGINAS =====

if (formularioViagem) {
    carregarViagens();
}

if (formularioDestino) {
    carregarOpcoesViagens("viagem");
    carregarDestinos();
}

if (formularioPasseio) {
    carregarOpcoesViagens("viagemPasseio");
    carregarPasseios();
}

if (formularioDespesa) {
    carregarOpcoesViagens("viagemDespesa");
    carregarDespesas();
}

atualizarDestinos();
