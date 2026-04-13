from pydantic import BaseModel
from typing import Optional, List
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
    descricao: Optional[str] = None

class CategoriaOut(CategoriaBase):
    id: int
    class Config:
        from_attributes = True

class PlanoBase(BaseModel):
    nome: str
    slug: str
    descricao: Optional[str] = None
    icone: Optional[str] = None

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
    descricao: Optional[str] = None
    tempo_resultado: Optional[str] = None
    preparo: Optional[str] = None

class ExameCreate(ExameBase):
    pass

class ExameUpdate(BaseModel):
    nome: Optional[str] = None
    descricao: Optional[str] = None
    tempo_resultado: Optional[str] = None
    preparo: Optional[str] = None
    ativo: Optional[bool] = None

class ExameOut(ExameBase):
    id: int
    ativo: bool
    categoria: CategoriaOut
    precos: List[PrecoOut] = []
    preco_minimo: Optional[Decimal] = None
    class Config:
        from_attributes = True

class CampanhaBase(BaseModel):
    nome: str
    descricao: Optional[str] = None
    desconto_percentual: Decimal
    data_inicio: date
    data_fim: date
    status: StatusCampanha = StatusCampanha.ativa

class CampanhaCreate(CampanhaBase):
    exame_ids: List[int] = []

class CampanhaUpdate(BaseModel):
    nome: Optional[str] = None
    descricao: Optional[str] = None
    desconto_percentual: Optional[Decimal] = None
    data_inicio: Optional[date] = None
    data_fim: Optional[date] = None
    status: Optional[StatusCampanha] = None

class CampanhaOut(CampanhaBase):
    id: int
    total_participantes: int = 0
    exames_incluidos: List[str] = []
    class Config:
        from_attributes = True

class PacienteBase(BaseModel):
    nome: str
    data_nascimento: date
    cpf: Optional[str] = None
    telefone: Optional[str] = None
    email: Optional[str] = None
    plano_id: Optional[int] = None
    etapa_jornada: EtapaJornada = EtapaJornada.primeiro_contato
    observacoes: Optional[str] = None

class PacienteCreate(PacienteBase):
    pass

class PacienteUpdate(BaseModel):
    nome: Optional[str] = None
    telefone: Optional[str] = None
    email: Optional[str] = None
    plano_id: Optional[int] = None
    etapa_jornada: Optional[EtapaJornada] = None
    observacoes: Optional[str] = None

class PacienteOut(PacienteBase):
    id: int
    ativo: bool
    plano: Optional[PlanoOut] = None
    idade: Optional[int] = None
    class Config:
        from_attributes = True

class DashboardStats(BaseModel):
    total_exames: int
    campanhas_ativas: int
    total_pacientes: int
    total_planos: int