# TripPlan

**Projeto Integrado de DWS, POO e Banco de Dados**

O TripPlan reúne o planejamento de viagens, destinos, passeios e despesas. Em **Minhas viagens**, é possível comparar o orçamento com o total gasto e ver o saldo. A página **Explorar** tem sugestões de destinos, com busca, filtro por categoria e sorteio.

## Executar no computador

Use Python 3.11 ou superior. Abra o terminal na pasta do TripPlan e execute os dois comandos abaixo.

```powershell
python -m pip install -r requirements.txt
python app.py
```

Abra [o TripPlan no navegador](http://127.0.0.1:5000/). Os formulários chamam o Flask via Fetch, e os dados são gravados em `database/tripplan.db`. Se o arquivo estiver ausente, o Flask o cria usando [o esquema SQLite](database/banco.sql).

## Apresentação

Para abrir o sistema com exemplos fictícios, execute `python app.py --demo`. As alterações desse modo são gravadas em `database/tripplan-demo.db`.

1. Em **Minhas viagens**, localize o roteiro pela Serra Gaúcha. Ele tem orçamento de **R$ 3.200,00**, total gasto de **R$ 900,00** e saldo de **R$ 2.300,00**.
2. Em **Despesas**, cadastre **R$ 100,00** de alimentação para esse roteiro.
3. Volte para **Minhas viagens**. O total passa para **R$ 1.000,00** e o saldo para **R$ 2.200,00**. Recarregue a página para verificar que a despesa foi salva.
4. Use **Editar** e **Excluir** na lista de despesas. Os cadastros de viagens, destinos e passeios têm as mesmas ações.

A [demonstração no GitHub Pages](https://giovannazini-ux.github.io/TripPlan/) usa a mesma interface e guarda as alterações no navegador. A execução no computador é a que apresenta a integração entre Fetch, Flask e SQLite.

## Modelagem

- [Diagrama de classes e modelo lógico](docs/modelagem.md)
- [Esquema SQLite](database/banco.sql)
- [Documentação do projeto e DER](Documenta%C3%A7%C3%A3o%20TripPlan/PROJETO%20INTEGRADO%20%E2%80%93%20TRIPPLAN.pdf)

## Organização

| Arquivo ou pasta | Responsabilidade |
|---|---|
| [app.py](app.py) | Rotas das páginas e da API Flask |
| [models.py](models.py) | Classes Viagem, Destino, Passeio e Despesa |
| [validacao.py](validacao.py) | Validação dos formulários e criação dos objetos |
| [dao/](dao/) | Consultas, gravação e conexão com SQLite |
| [templates/](templates/) e [static/](static/) | HTML, CSS e JavaScript da interface |
| [gerar_pages.py](gerar_pages.py) | Geração dos arquivos estáticos da demonstração no GitHub Pages |

## API

As coleções são `viagens`, `destinos`, `passeios` e `despesas`. Consulte `GET /api` para conferir o status do Flask.

| Método e caminho | Operação |
|---|---|
| `GET /api/<coleção>` | Lista registros |
| `POST /api/<coleção>` | Cadastra um registro com dados JSON |
| `PUT /api/<coleção>/<id>` | Atualiza um registro com dados JSON |
| `DELETE /api/<coleção>/<id>` | Exclui um registro |

A rota de viagens inclui `total_despesas`. As chaves estrangeiras exigem que destinos, passeios e despesas pertençam a uma viagem existente. Para excluir uma viagem, remova primeiro os registros vinculados a ela.

## Verificação e publicação

Execute os testes com `python -m unittest discover -s tests -v`. O arquivo de publicação em [GitHub Actions](.github/workflows/jekyll-gh-pages.yml) executa os testes e monta a demonstração a partir dos mesmos templates. A origem da publicação fica em **Settings → Pages → Source → GitHub Actions**.

## Desenvolvedora

Giovanna Pagliarini Zini · 2º TI-C
