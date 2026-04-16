from sqlalchemy import Column, Integer, String, Text, Boolean, Date, DateTime, DECIMAL, Enum, ForeignKey, UniqueConstraint
from sqlalchemy.orm import relationship
from sqlalchemy.sql import func
from app.database import Base
import enum

class StatusCampanha(str, enum.Enum):
    ativa = "ativa"
    pausada = "pausada"
    encerrada = "encerrada"

class EtapaJornada(str, enum.Enum):
    primeiro_contato = "primeiro_contato"
    avaliacao = "avaliacao"
    tratamento = "tratamento"
    acompanhamento = "acompanhamento"
    fidelizado = "fidelizado"

class Categoria(Base):
    __tablename__ = "categorias"
    id = Column(Integer, primary_key=True, index=True)
    nome = Column(String(100), nullable=False)
    descricao = Column(Text)
    criado_em = Column(DateTime, server_default=func.now())
    exames = relationship("Exame", back_populates="categoria")

class Plano(Base):
    __tablename__ = "planos"
    id = Column(Integer, primary_key=True, index=True)
    nome = Column(String(100), nullable=False)
    slug = Column(String(50), unique=True, nullable=False)
    descricao = Column(Text)
    icone = Column(String(50))
    ativo = Column(Boolean, default=True)
    criado_em = Column(DateTime, server_default=func.now())
    precos = relationship("Preco", back_populates="plano")
    pacientes = relationship("Paciente", back_populates="plano")

class Exame(Base):
    __tablename__ = "exames"
    id = Column(Integer, primary_key=True, index=True)
    nome = Column(String(150), nullable=False)
    categoria_id = Column(Integer, ForeignKey("categorias.id"), nullable=False)
    descricao = Column(Text)
    tempo_resultado = Column(String(50))
    preparo = Column(Text)
    ativo = Column(Boolean, default=True)
    criado_em = Column(DateTime, server_default=func.now())
    atualizado_em = Column(DateTime, server_default=func.now(), onupdate=func.now())
    categoria = relationship("Categoria", back_populates="exames")
    precos = relationship("Preco", back_populates="exame")

class Preco(Base):
    __tablename__ = "precos"
    id = Column(Integer, primary_key=True, index=True)
    exame_id = Column(Integer, ForeignKey("exames.id"), nullable=False)
    plano_id = Column(Integer, ForeignKey("planos.id"), nullable=False)
    preco = Column(DECIMAL(10, 2), nullable=False)
    ativo = Column(Boolean, default=True)
    atualizado_em = Column(DateTime, server_default=func.now(), onupdate=func.now())
    exame = relationship("Exame", back_populates="precos")
    plano = relationship("Plano", back_populates="precos")
    __table_args__ = (UniqueConstraint("exame_id", "plano_id"),)

class Campanha(Base):
    __tablename__ = "campanhas"
    id = Column(Integer, primary_key=True, index=True)
    nome = Column(String(150), nullable=False)
    descricao = Column(Text)
    desconto_percentual = Column(DECIMAL(5, 2), nullable=False)
    data_inicio = Column(Date, nullable=False)
    data_fim = Column(Date, nullable=False)
    status = Column(Enum(StatusCampanha), default=StatusCampanha.ativa)
    criado_em = Column(DateTime, server_default=func.now())
    atualizado_em = Column(DateTime, server_default=func.now(), onupdate=func.now())
    exames = relationship("CampanhaExame", back_populates="campanha")
    pacientes = relationship("CampanhaPaciente", back_populates="campanha")

class CampanhaExame(Base):
    __tablename__ = "campanha_exames"
    id = Column(Integer, primary_key=True, index=True)
    campanha_id = Column(Integer, ForeignKey("campanhas.id"), nullable=False)
    exame_id = Column(Integer, ForeignKey("exames.id"), nullable=False)
    campanha = relationship("Campanha", back_populates="exames")
    exame = relationship("Exame")
    __table_args__ = (UniqueConstraint("campanha_id", "exame_id"),)

class Paciente(Base):
    __tablename__ = "pacientes"
    id = Column(Integer, primary_key=True, index=True)
    nome = Column(String(200), nullable=False)
    data_nascimento = Column(Date, nullable=False)
    cpf = Column(String(14), unique=True)
    telefone = Column(String(20))
    email = Column(String(150))
    plano_id = Column(Integer, ForeignKey("planos.id"))
    etapa_jornada = Column(Enum(EtapaJornada), default=EtapaJornada.primeiro_contato)
    observacoes = Column(Text)
    ativo = Column(Boolean, default=True)
    criado_em = Column(DateTime, server_default=func.now())
    atualizado_em = Column(DateTime, server_default=func.now(), onupdate=func.now())
    plano = relationship("Plano", back_populates="pacientes")
    campanhas = relationship("CampanhaPaciente", back_populates="paciente")

class CampanhaPaciente(Base):
    __tablename__ = "campanha_pacientes"
    id = Column(Integer, primary_key=True, index=True)
    campanha_id = Column(Integer, ForeignKey("campanhas.id"), nullable=False)
    paciente_id = Column(Integer, ForeignKey("pacientes.id"), nullable=False)
    inscrito_em = Column(DateTime, server_default=func.now())
    campanha = relationship("Campanha", back_populates="pacientes")
    paciente = relationship("Paciente", back_populates="campanhas")
    __table_args__ = (UniqueConstraint("campanha_id", "paciente_id"),)