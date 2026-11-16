from dataclasses import dataclass


@dataclass(frozen=True)
class Viagem:
    nome: str
    destino: str
    data_ida: str
    data_volta: str
    orcamento: float


@dataclass(frozen=True)
class Destino:
    id_viagem: int
    cidade: str
    pais: str
    descricao: str = ""


@dataclass(frozen=True)
class Passeio:
    id_viagem: int
    nome: str
    data: str
    descricao: str = ""


@dataclass(frozen=True)
class Despesa:
    id_viagem: int
    descricao: str
    categoria: str
    valor: float
