PROJETO INTEGRADO – TRIPPLAN
Sistema de Planejamento e Organização de Viagens
Aluna: Giovanna Pagliarini Zini
Turma: 2°TIC
Desenvolvimento: Individual
Área: Desenvolvimento de Websites, Programação Orientada a Objetos e Banco de Dados

1. INTRODUÇÃO
O TripPlan é um sistema desenvolvido para facilitar o planejamento e a organização de viagens. A proposta é reunir em um único lugar as principais informações de uma viagem, permitindo que o usuário cadastre destinos, datas, passeios e despesas.
Muitas pessoas encontram dificuldades para organizar todos os detalhes de uma viagem, principalmente quando precisam controlar horários, atividades e gastos. Pensando nisso, o TripPlan busca oferecer uma solução simples e prática para ajudar nessa organização.
O sistema será desenvolvido utilizando HTML, CSS, JavaScript, Python, Flask e SQLite.
2. JUSTIFICATIVA
A criação do TripPlan surgiu da ideia de desenvolver uma ferramenta que facilite a organização de viagens e ajude as pessoas a planejarem seus compromissos e gastos.
O sistema pretende tornar esse processo mais organizado, evitando que informações importantes fiquem espalhadas em diferentes lugares. Além disso, o projeto permite aplicar conhecimentos de programação, desenvolvimento web e banco de dados.
3. OBJETIVO GERAL
Desenvolver um sistema web que permita organizar viagens de maneira simples e prática, possibilitando o cadastro de destinos, passeios, datas e despesas.
4. OBJETIVOS ESPECÍFICOS
Permitir o cadastro de viagens.
Registrar destinos e informações sobre os locais.
Organizar passeios e atividades durante a viagem.
Cadastrar despesas e acompanhar os gastos.
Permitir a edição e exclusão de informações.
Desenvolver uma interface simples e fácil de utilizar.
Armazenar os dados em um banco de dados.
5. PÚBLICO-ALVO
O sistema será destinado a pessoas que desejam organizar suas viagens de maneira prática, independentemente da duração ou do destino escolhido.
6. FUNCIONALIDADES DO SISTEMA
O TripPlan contará com as seguintes funcionalidades:
6.1. Cadastro de viagens
O usuário poderá cadastrar uma viagem informando o nome, destino, data de ida, data de volta e orçamento disponível.
6.2. Cadastro de destinos
O sistema permitirá registrar cidades, países e informações sobre os destinos escolhidos.
6.3. Organização de passeios
Será possível cadastrar atividades e passeios, informando o nome, a data e uma descrição.
6.4. Controle de despesas
O usuário poderá registrar os gastos da viagem, informando a descrição, o valor e a categoria da despesa.
6.5. Gerenciamento de informações
O sistema permitirá consultar, editar e excluir viagens, passeios e despesas cadastradas.
7. REQUISITOS FUNCIONAIS (RF)
RF01 – O sistema deverá permitir o cadastro de viagens.
RF02 – O sistema deverá permitir a consulta das viagens cadastradas.
RF03 – O sistema deverá permitir a edição e exclusão de viagens.
RF04 – O sistema deverá permitir o cadastro de destinos.
RF05 – O sistema deverá permitir o cadastro de passeios e atividades.
RF06 – O sistema deverá permitir o cadastro de despesas.
RF07 – O sistema deverá apresentar os gastos registrados em cada viagem.
RF08 – O sistema deverá permitir a edição e exclusão de passeios e despesas.
8. REQUISITOS NÃO FUNCIONAIS (RNF)
RNF01 – O sistema deverá apresentar uma interface simples e organizada.
RNF02 – O sistema deverá funcionar em navegadores modernos.
RNF03 – Os dados deverão ser armazenados em um banco de dados SQLite.
RNF04 – O sistema deverá ser desenvolvido utilizando Python e Flask no back-end.
RNF05 – O sistema deverá apresentar informações de maneira clara e organizada.
RNF06 – O código deverá ser organizado para facilitar futuras alterações.
9. TECNOLOGIAS UTILIZADAS
HTML: responsável pela estrutura das páginas.
CSS: responsável pela aparência e organização visual do sistema.
JavaScript: responsável pelas interações da interface.
Python: utilizado na programação do back-end.
Flask: utilizado para criar as rotas e conectar o front-end ao back-end.
SQLite: utilizado para armazenar as informações cadastradas.
10. MODELAGEM DO BANCO DE DADOS
O banco de dados do TripPlan será organizado em quatro tabelas principais.
Tabela VIAGENS
id_viagem – Identificador da viagem.
nome – Nome da viagem.
destino – Local escolhido.
data_ida – Data de início.
data_volta – Data de retorno.
orcamento – Valor disponível.
Tabela DESTINOS
id_destino – Identificador do destino.
id_viagem – Viagem relacionada.
cidade – Nome da cidade.
pais – Nome do país.
descricao – Informações sobre o destino.
Tabela PASSEIOS
id_passeio – Identificador do passeio.
id_viagem – Viagem relacionada.
nome – Nome da atividade.
data – Data do passeio.
descricao – Descrição da atividade.
Tabela DESPESAS
id_despesa – Identificador da despesa.
id_viagem – Viagem relacionada.
descricao – Descrição do gasto.
categoria – Categoria da despesa.
valor – Valor gasto.
11. RELACIONAMENTO ENTRE AS TABELAS
A tabela VIAGENS será a principal do sistema e estará relacionada às outras três tabelas.
Uma viagem poderá possuir vários destinos.
Uma viagem poderá possuir vários passeios.
Uma viagem poderá possuir várias despesas.
O relacionamento será feito utilizando o campo id_viagem como chave estrangeira nas tabelas relacionadas.
12. RESULTADO ESPERADO
Espera-se que o TripPlan seja um sistema funcional, capaz de facilitar a organização de viagens e permitir que o usuário controle seus destinos, passeios e despesas em um único ambiente.
O projeto também permitirá colocar em prática os conhecimentos adquiridos nas disciplinas de Desenvolvimento de Websites, Programação Orientada a Objetos e Banco de Dados.

