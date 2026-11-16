from datetime import date
from decimal import Decimal, InvalidOperation

from models import Destino, Despesa, Passeio, Viagem


def ler_texto(dados, campo, rotulo, *, opcional=False):
    valor = dados.get(campo, "" if opcional else None)
    if opcional and valor is None:
        return ""
    if not isinstance(valor, str) or (not opcional and not valor.strip()):
        raise ValueError(f"Preencha o campo {rotulo}.")
    return valor.strip()


def ler_data(dados, campo, rotulo):
    texto = ler_texto(dados, campo, rotulo)
    try:
        data = date.fromisoformat(texto)
        if data.isoformat() == texto:
            return texto
    except ValueError:
        pass
    raise ValueError(f"Informe uma data válida para {rotulo}.")


def ler_valor(dados, campo, rotulo):
    mensagem = f"Informe {rotulo} entre R$ 0,01 e R$ 99.999.999,99, com até duas casas decimais."
    try:
        valor = Decimal(str(dados.get(campo)))
    except InvalidOperation:
        raise ValueError(mensagem) from None
    if not valor.is_finite() or not Decimal("0.01") <= valor <= Decimal("99999999.99"):
        raise ValueError(mensagem)
    if valor != valor.quantize(Decimal("0.01")):
        raise ValueError(mensagem)
    return float(valor)


def ler_id_viagem(dados):
    valor = dados.get("id_viagem")
    try:
        if type(valor) in (int, str):
            id_viagem = int(valor)
            if 0 < id_viagem <= 2**63 - 1:
                return id_viagem
    except ValueError:
        pass
    raise ValueError("Selecione uma viagem.")


def montar_viagem(dados):
    ida = ler_data(dados, "data_ida", "data de ida")
    volta = ler_data(dados, "data_volta", "data de volta")
    if volta < ida:
        raise ValueError("A data de volta deve ser igual ou posterior à data de ida.")
    return Viagem(
        nome=ler_texto(dados, "nome", "nome da viagem"),
        destino=ler_texto(dados, "destino", "destino principal"),
        data_ida=ida,
        data_volta=volta,
        orcamento=ler_valor(dados, "orcamento", "um orçamento"),
    )


def montar_destino(dados):
    return Destino(
        id_viagem=ler_id_viagem(dados),
        cidade=ler_texto(dados, "cidade", "cidade"),
        pais=ler_texto(dados, "pais", "país"),
        descricao=ler_texto(dados, "descricao", "descrição", opcional=True),
    )


def montar_passeio(dados):
    return Passeio(
        id_viagem=ler_id_viagem(dados),
        nome=ler_texto(dados, "nome", "nome do passeio"),
        data=ler_data(dados, "data", "data do passeio"),
        descricao=ler_texto(dados, "descricao", "descrição", opcional=True),
    )


def montar_despesa(dados):
    return Despesa(
        id_viagem=ler_id_viagem(dados),
        descricao=ler_texto(dados, "descricao", "descrição"),
        categoria=ler_texto(dados, "categoria", "categoria"),
        valor=ler_valor(dados, "valor", "um valor"),
    )
