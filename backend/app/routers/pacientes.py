from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy.orm import Session
from typing import List, Optional
from datetime import date
from app.database import get_db
from app import models, schemas

router = APIRouter()

def calcular_idade(data_nascimento: date) -> int:
    hoje = date.today()
    return hoje.year - data_nascimento.year - (
        (hoje.month, hoje.day) < (data_nascimento.month, data_nascimento.day)
    )

@router.get("/", response_model=List[schemas.PacienteOut])
def listar_pacientes(
    busca: Optional[str] = Query(None),
    etapa: Optional[str] = Query(None),
    db: Session = Depends(get_db)
):
    query = db.query(models.Paciente).filter(models.Paciente.ativo == True)
    if busca:
        query = query.filter(models.Paciente.nome.ilike(f"%{busca}%"))
    if etapa:
        query = query.filter(models.Paciente.etapa_jornada == etapa)
    pacientes = query.all()
    resultado = []
    for p in pacientes:
        out = schemas.PacienteOut(
            id=p.id, nome=p.nome, data_nascimento=p.data_nascimento,
            cpf=p.cpf, telefone=p.telefone, email=p.email,
            plano_id=p.plano_id, etapa_jornada=p.etapa_jornada,
            observacoes=p.observacoes, ativo=p.ativo,
            plano=p.plano, idade=calcular_idade(p.data_nascimento)
        )
        resultado.append(out)
    return resultado

@router.get("/{paciente_id}", response_model=schemas.PacienteOut)
def buscar_paciente(paciente_id: int, db: Session = Depends(get_db)):
    p = db.query(models.Paciente).filter(
        models.Paciente.id == paciente_id, models.Paciente.ativo == True
    ).first()
    if not p:
        raise HTTPException(status_code=404, detail="Paciente não encontrado")
    return schemas.PacienteOut(
        id=p.id, nome=p.nome, data_nascimento=p.data_nascimento,
        cpf=p.cpf, telefone=p.telefone, email=p.email,
        plano_id=p.plano_id, etapa_jornada=p.etapa_jornada,
        observacoes=p.observacoes, ativo=p.ativo,
        plano=p.plano, idade=calcular_idade(p.data_nascimento)
    )

@router.post("/", response_model=schemas.PacienteOut, status_code=201)
def criar_paciente(paciente_in: schemas.PacienteCreate, db: Session = Depends(get_db)):
    paciente = models.Paciente(**paciente_in.model_dump())
    db.add(paciente)
    db.commit()
    db.refresh(paciente)
    return schemas.PacienteOut(
        id=paciente.id, nome=paciente.nome, data_nascimento=paciente.data_nascimento,
        cpf=paciente.cpf, telefone=paciente.telefone, email=paciente.email,
        plano_id=paciente.plano_id, etapa_jornada=paciente.etapa_jornada,
        observacoes=paciente.observacoes, ativo=paciente.ativo,
        plano=paciente.plano, idade=calcular_idade(paciente.data_nascimento)
    )

@router.put("/{paciente_id}", response_model=schemas.PacienteOut)
def atualizar_paciente(paciente_id: int, paciente_in: schemas.PacienteUpdate, db: Session = Depends(get_db)):
    p = db.query(models.Paciente).filter(models.Paciente.id == paciente_id).first()
    if not p:
        raise HTTPException(status_code=404, detail="Paciente não encontrado")
    for campo, valor in paciente_in.model_dump(exclude_unset=True).items():
        setattr(p, campo, valor)
    db.commit()
    db.refresh(p)
    return schemas.PacienteOut(
        id=p.id, nome=p.nome, data_nascimento=p.data_nascimento,
        cpf=p.cpf, telefone=p.telefone, email=p.email,
        plano_id=p.plano_id, etapa_jornada=p.etapa_jornada,
        observacoes=p.observacoes, ativo=p.ativo,
        plano=p.plano, idade=calcular_idade(p.data_nascimento)
    )

@router.delete("/{paciente_id}", status_code=204)
def deletar_paciente(paciente_id: int, db: Session = Depends(get_db)):
    p = db.query(models.Paciente).filter(models.Paciente.id == paciente_id).first()
    if not p:
        raise HTTPException(status_code=404, detail="Paciente não encontrado")
    p.ativo = False
    db.commit()