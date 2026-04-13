from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy.orm import Session
from typing import List, Optional
from app.database import get_db
from app import models, schemas

router = APIRouter()

@router.get("/", response_model=List[schemas.CampanhaOut])
def listar_campanhas(
    status: Optional[str] = Query(None),
    db: Session = Depends(get_db)
):
    query = db.query(models.Campanha)
    if status:
        query = query.filter(models.Campanha.status == status)
    campanhas = query.all()
    resultado = []
    for c in campanhas:
        total = len(c.pacientes)
        exames_nomes = [ce.exame.nome for ce in c.exames]
        resultado.append(schemas.CampanhaOut(
            id=c.id, nome=c.nome, descricao=c.descricao,
            desconto_percentual=c.desconto_percentual,
            data_inicio=c.data_inicio, data_fim=c.data_fim,
            status=c.status, total_participantes=total,
            exames_incluidos=exames_nomes
        ))
    return resultado

@router.post("/", response_model=schemas.CampanhaOut, status_code=201)
def criar_campanha(campanha_in: schemas.CampanhaCreate, db: Session = Depends(get_db)):
    dados = campanha_in.model_dump(exclude={"exame_ids"})
    campanha = models.Campanha(**dados)
    db.add(campanha)
    db.commit()
    db.refresh(campanha)
    for exame_id in campanha_in.exame_ids:
        ce = models.CampanhaExame(campanha_id=campanha.id, exame_id=exame_id)
        db.add(ce)
    db.commit()
    db.refresh(campanha)
    return schemas.CampanhaOut(
        id=campanha.id, nome=campanha.nome, descricao=campanha.descricao,
        desconto_percentual=campanha.desconto_percentual,
        data_inicio=campanha.data_inicio, data_fim=campanha.data_fim,
        status=campanha.status, total_participantes=0,
        exames_incluidos=[ce.exame.nome for ce in campanha.exames]
    )

@router.put("/{campanha_id}", response_model=schemas.CampanhaOut)
def atualizar_campanha(campanha_id: int, campanha_in: schemas.CampanhaUpdate, db: Session = Depends(get_db)):
    campanha = db.query(models.Campanha).filter(models.Campanha.id == campanha_id).first()
    if not campanha:
        raise HTTPException(status_code=404, detail="Campanha não encontrada")
    for campo, valor in campanha_in.model_dump(exclude_unset=True).items():
        setattr(campanha, campo, valor)
    db.commit()
    db.refresh(campanha)
    return schemas.CampanhaOut(
        id=campanha.id, nome=campanha.nome, descricao=campanha.descricao,
        desconto_percentual=campanha.desconto_percentual,
        data_inicio=campanha.data_inicio, data_fim=campanha.data_fim,
        status=campanha.status, total_participantes=len(campanha.pacientes),
        exames_incluidos=[ce.exame.nome for ce in campanha.exames]
    )