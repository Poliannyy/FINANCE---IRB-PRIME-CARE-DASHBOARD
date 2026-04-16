from fastapi import APIRouter, Depends, Query
from sqlalchemy.orm import Session
from typing import List, Optional
from app.database import get_db
from app import models, schemas

router = APIRouter()

@router.get("/", response_model=List[schemas.PlanoOut])
def listar_planos(db: Session = Depends(get_db)):
    return db.query(models.Plano).filter(models.Plano.ativo == True).all()

@router.get("/tabela")
def tabela_comparativa(
    busca: Optional[str] = Query(None),
    db: Session = Depends(get_db)
):
    query = db.query(models.Exame).filter(models.Exame.ativo == True)
    if busca:
        query = query.filter(models.Exame.nome.ilike(f"%{busca}%"))
    exames = query.all()
    planos = db.query(models.Plano).filter(models.Plano.ativo == True).all()
    tabela = []
    for exame in exames:
        linha = {
            "exame_id": exame.id,
            "exame_nome": exame.nome,
            "categoria": exame.categoria.nome
        }
        preco_map = {p.plano_id: float(p.preco) for p in exame.precos if p.ativo}
        for plano in planos:
            linha[plano.slug] = preco_map.get(plano.id)
        tabela.append(linha)
    return {"planos": [{"id": p.id, "nome": p.nome, "slug": p.slug} for p in planos], "tabela": tabela}