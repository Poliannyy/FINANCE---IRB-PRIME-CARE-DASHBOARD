from pydantic import BaseModel
from typing import List
from datetime import date, datetime
from decimal import Decimal
from enum import Enum

class StatusCampanha(str, Enum):
    ativa = "ativa"
    pausada = "pausada"
    encerrada = "encerrada"

class EtapaJornada(str, Enum):
    primeiro_contato = "primeiro_contato"
    avaliacao = "avaliacao"
    tratamento = "tratamento"
    acompanhamento = "acompanhamento"
    fidelizado = "fidelizado"

class CategoriaBase(BaseModel):
    nome: str
    descricao: str

class CategoriaOut(CategoriaBase):
    id: int
    class Config:
        from_attributes = True

class PlanoBase(BaseModel):
    nome: str
    slug: str
    descricao: str
    icone: str

class PlanoOut(PlanoBase):
    id: int
    class Config:
        from_attributes = True

class PrecoOut(BaseModel):
    plano_id: int
    plano_nome: str
    preco: Decimal
    class Config:
        from_attributes = True

class ExameBase(BaseModel):
    nome: str
    categoria_id: int
    descricao: str
    tempo_resultado: str
    preparo: str

class ExameCreate(ExameBase):
    preco_particular: Decimal
    preco_prime_plus: Decimal
    preco_prime_essential: Decimal
    preco_prime_elite: Decimal

class ExameUpdate(BaseModel):
    nome: str
    descricao: str
    tempo_resultado: str
    preparo: str
    ativo: bool

class ExameOut(ExameBase):
    id: int
    ativo: bool
    categoria: CategoriaOut
    precos: List[PrecoOut]
    preco_minimo: Decimal
    class Config:
        from_attributes = True

class CampanhaBase(BaseModel):
    nome: str
    descricao: str
    desconto_percentual: Decimal
    data_inicio: date
    data_fim: date
    status: StatusCampanha

class CampanhaCreate(CampanhaBase):
    exame_ids: List[int]

class CampanhaUpdate(BaseModel):
    nome: str
    descricao: str
    desconto_percentual: Decimal
    data_inicio: date
    data_fim: date
    status: StatusCampanha

class CampanhaOut(CampanhaBase):
    id: int
    total_participantes: int
    exames_incluidos: List[str]
    class Config:
        from_attributes = True

class PacienteBase(BaseModel):
    nome: str
    data_nascimento: date
    cpf: str
    telefone: str
    email: str
    plano_id: int
    etapa_jornada: EtapaJornada
    observacoes: str

class PacienteCreate(PacienteBase):
    pass

class PacienteUpdate(BaseModel):
    nome: str
    data_nascimento: date
    cpf: str
    telefone: str
    email: str
    plano_id: int
    etapa_jornada: EtapaJornada
    observacoes: str

class PacienteOut(PacienteBase):
    id: int
    ativo: bool
    plano: PlanoOut
    idade: int
    class Config:
        from_attributes = True

class DashboardStats(BaseModel):
    total_exames: int
    campanhas_ativas: int
    total_pacientes: int
    total_planos: int
