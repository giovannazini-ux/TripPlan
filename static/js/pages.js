const CHAVE = "tripplan-demonstracao-v1";
const chaves = {
    viagens: "id_viagem",
    destinos: "id_destino",
    passeios: "id_passeio",
    despesas: "id_despesa"
};

async function carregarEstado() {
    const salvo = localStorage.getItem(CHAVE);
    if (salvo !== null) return JSON.parse(salvo);

    const resposta = await fetch(new URL("../../dados/demonstracao.json", import.meta.url));
    if (!resposta.ok) throw new Error("Não foi possível carregar os exemplos da demonstração.");
    const colecoes = await resposta.json();
    const ultimosIds = {};
    for (const [colecao, chave] of Object.entries(chaves)) {
        ultimosIds[colecao] = Math.max(0, ...colecoes[colecao].map(registro => registro[chave]));
    }
    const estado = { colecoes, ultimosIds };
    localStorage.setItem(CHAVE, JSON.stringify(estado));
    return estado;
}

function listar(colecoes, colecao) {
    return colecoes[colecao].slice().reverse().map(registro => {
        if (colecao === "viagens") {
            const centavos = colecoes.despesas
                .filter(despesa => despesa.id_viagem === registro.id_viagem)
                .reduce((total, despesa) => total + Math.round(despesa.valor * 100), 0);
            return { ...registro, total_despesas: centavos / 100 };
        }
        const viagem = colecoes.viagens.find(viagem => viagem.id_viagem === registro.id_viagem);
        return { ...registro, nome_viagem: viagem.nome };
    });
}

export async function requisitarDemo(colecao, metodo, id, dados) {
    async function executar() {
        const estado = await carregarEstado();
        const { colecoes, ultimosIds } = estado;
        if (metodo === "GET") return listar(colecoes, colecao);

        const chave = chaves[colecao];
        const registros = colecoes[colecao];
        const indice = registros.findIndex(registro => registro[chave] === id);
        if (metodo !== "POST" && indice === -1) throw new Error("Registro não encontrado.");

        if (metodo === "DELETE") {
            const temVinculos = colecao === "viagens" && ["destinos", "passeios", "despesas"].some(
                tabela => colecoes[tabela].some(registro => registro.id_viagem === id)
            );
            if (temVinculos) throw new Error("Exclua os destinos, passeios e despesas vinculados à viagem primeiro.");
            registros.splice(indice, 1);
        } else {
            const registro = Object.fromEntries(Object.entries(dados).map(([campo, valor]) => [campo, valor.trim()]));
            for (const numerico of ["id_viagem", "orcamento", "valor"]) {
                if (numerico in registro) registro[numerico] = Number(registro[numerico]);
            }
            if (colecao !== "viagens" && !colecoes.viagens.some(viagem => viagem.id_viagem === registro.id_viagem)) {
                throw new Error("Selecione uma viagem cadastrada.");
            }
            if (metodo === "POST") {
                id = ++ultimosIds[colecao];
                registros.push({ ...registro, [chave]: id });
            } else {
                registros[indice] = { ...registro, [chave]: id };
            }
        }
        localStorage.setItem(CHAVE, JSON.stringify(estado));
        const mensagens = { POST: "Cadastro realizado.", PUT: "Alterações salvas.", DELETE: "Registro excluído." };
        return { id, mensagem: mensagens[metodo] };
    }

    return navigator.locks ? navigator.locks.request(CHAVE, executar) : executar();
}
