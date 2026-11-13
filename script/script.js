
const formulario = document.getElementById("formViagem");

async function carregarViagens() {
    if (!document.getElementById("formViagem")) return;

    const lista = document.querySelector(".lista-viagens");
    if (!lista) return;

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
                    <h3>Nenhuma viagem cadastrada</h3>
                    <p>Suas próximas aventuras aparecerão aqui.</p>
                </div>
            `;
            return;
        }

        viagens.forEach(viagem => {
            const card = document.createElement("div");
            card.className = "card-viagem";

            card.innerHTML = `
                <h3>${viagem.nome}</h3>
                <p>Destino: ${viagem.destino}</p>
                <p>Ida: ${viagem.data_ida}</p>
                <p>Volta: ${viagem.data_volta}</p>
                <p>Orçamento: R$ ${Number(viagem.orcamento).toFixed(2)}</p>
            `;

            lista.appendChild(card);
        });

    } catch (erro) {
        alert("Não foi possível carregar as viagens.");
    }
}

if (formulario) {
    formulario.addEventListener("submit", async function(event) {
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
                headers: {"Content-Type": "application/json"},
                body: JSON.stringify(viagem)
            });

            const resultado = await resposta.json();

            if (resposta.ok) {
                alert("Viagem cadastrada com sucesso!");
                formulario.reset();
                carregarViagens();
            } else {
                alert(resultado.erro || "Erro ao cadastrar viagem.");
            }

        } catch (erro) {
            alert("Não foi possível conectar ao servidor.");
        }
    });
}

carregarViagens();


async function carregarViagensNoSelect() {
    const select = document.getElementById("viagem");
    if (!select) return;

    try {
        const resposta = await fetch("/api/viagens");
        const viagens = await resposta.json();

        viagens.forEach(viagem => {
            const opcao = document.createElement("option");
            opcao.value = viagem.id_viagem;
            opcao.textContent = viagem.nome;
            select.appendChild(opcao);
        });

    } catch (erro) {
        alert("Não foi possível carregar as viagens.");
    }
}

carregarViagensNoSelect();


const formularioDestino = document.getElementById("formDestino");

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
                headers: {"Content-Type": "application/json"},
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


async function carregarDestinos() {
    if (!document.getElementById("formDestino")) return;

    const lista = document.querySelector(".lista-viagens");
    if (!lista) return;

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
                    <p>Seus destinos aparecerão aqui depois de cadastrados.</p>
                </div>
            `;
            return;
        }

        destinos.forEach(destino => {
            const card = document.createElement("div");
            card.className = "card-viagem";

            const titulo = document.createElement("h3");
            titulo.textContent = destino.cidade + " - " + destino.pais;

            const viagem = document.createElement("p");
            viagem.textContent = "Viagem: " + destino.nome_viagem;

            const descricao = document.createElement("p");
            descricao.textContent = destino.descricao || "Sem descrição.";

            card.appendChild(titulo);
            card.appendChild(viagem);
            card.appendChild(descricao);

            lista.appendChild(card);
        });

    } catch (erro) {
        alert("Não foi possível carregar os destinos.");
    }
}

carregarDestinos();


async function carregarViagensNoPasseio() {
    const select = document.getElementById("viagemPasseio");
    if (!select) return;

    try {
        const resposta = await fetch("/api/viagens");
        const viagens = await resposta.json();

        viagens.forEach(viagem => {
            const opcao = document.createElement("option");
            opcao.value = viagem.id_viagem;
            opcao.textContent = viagem.nome;
            select.appendChild(opcao);
        });

    } catch (erro) {
        alert("Não foi possível carregar as viagens.");
    }
}


const formularioPasseio = document.getElementById("formPasseio");

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
                headers: {"Content-Type": "application/json"},
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


async function carregarPasseios() {
    if (!document.getElementById("formPasseio")) return;

    const lista = document.querySelector(".lista-viagens");
    if (!lista) return;

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
                    <p>Seus passeios aparecerão aqui depois de cadastrados.</p>
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
            descricao.textContent = passeio.descricao || "Sem descrição.";

            card.appendChild(titulo);
            card.appendChild(data);
            card.appendChild(viagem);
            card.appendChild(descricao);

            lista.appendChild(card);
        });

    } catch (erro) {
        alert("Não foi possível carregar os passeios.");
    }
}

carregarViagensNoPasseio();
carregarPasseios();


async function carregarViagensNaDespesa() {
    const select = document.getElementById("viagemDespesa");
    if (!select) return;

    try {
        const resposta = await fetch("/api/viagens");
        const viagens = await resposta.json();

        viagens.forEach(viagem => {
            const opcao = document.createElement("option");
            opcao.value = viagem.id_viagem;
            opcao.textContent = viagem.nome;
            select.appendChild(opcao);
        });

    } catch (erro) {
        alert("Não foi possível carregar as viagens.");
    }
}


const formularioDespesa = document.getElementById("formDespesa");

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
                headers: {"Content-Type": "application/json"},
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


async function carregarDespesas() {
    if (!document.getElementById("formDespesa")) return;

    const lista = document.querySelector(".lista-viagens");
    if (!lista) return;

    try {
        const resposta = await fetch("/api/despesas");
        const despesas = await resposta.json();

        lista.innerHTML = `
            <div class="lista-titulo">
                <div>
                    <span class="etiqueta">SEUS GASTOS</span>
                    <h2>Despesas cadastradas</h2>
                </div>
            </div>
        `;

        if (despesas.length === 0) {
            lista.innerHTML += `
                <div class="vazio">
                    <h3>Nenhuma despesa cadastrada</h3>
                    <p>Seus gastos aparecerão aqui depois de cadastrados.</p>
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

            card.appendChild(titulo);
            card.appendChild(categoria);
            card.appendChild(valor);
            card.appendChild(viagem);

            lista.appendChild(card);
        });

    } catch (erro) {
        alert("Não foi possível carregar as despesas.");
    }
}

carregarViagensNaDespesa();
carregarDespesas();
