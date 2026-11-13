
const formulario = document.getElementById("formViagem");

async function carregarViagens() {
    const lista = document.querySelector(".lista-viagens");

    if (!lista || !formulario) return;

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

            card.appendChild(titulo);
            card.appendChild(destino);
            card.appendChild(ida);
            card.appendChild(volta);
            card.appendChild(orcamento);

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
                headers: {
                    "Content-Type": "application/json"
                },
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


// ===== EXPLORAR DESTINOS =====

const destinos = document.querySelectorAll(".destino-card");
const categorias = document.querySelectorAll(".categoria-card");

function filtrarDestinos(categoria) {
    destinos.forEach(destino => {
        const tipo = destino.querySelector("small").textContent
            .toLowerCase();

        if (categoria === "todos" || tipo.includes(categoria)) {
            destino.style.display = "block";
        } else {
            destino.style.display = "none";
        }
    });
}

categorias.forEach(categoria => {
    categoria.addEventListener("click", function() {
        const nome = this.querySelector("h3").textContent.toLowerCase();

        if (nome.includes("praias")) {
            filtrarDestinos("praias");
        } else if (nome.includes("natureza")) {
            filtrarDestinos("natureza");
        } else if (nome.includes("cultura")) {
            filtrarDestinos("cultura");
        } else if (nome.includes("grandes")) {
            filtrarDestinos("grandes cidades");
        }
    });
});
