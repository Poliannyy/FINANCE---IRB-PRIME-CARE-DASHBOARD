from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy.orm import Session
from typing import List, Optional
from app.database import get_db
from app import models, schemas

router = APIRouter()

@router.get("/", response_model=List[schemas.ExameOut])
def listar_exames(
    busca: Optional[str] = Query(None),
    categoria: Optional[str] = Query(None),
    db: Session = Depends(get_db)
):
    query = db.query(models.Exame).filter(models.Exame.ativo == True)
    if busca:
        query = query.filter(models.Exame.nome.ilike(f"%{busca}%"))
    if categoria and categoria != "Todos":
        query = query.join(models.Categoria).filter(models.Categoria.nome == categoria)
    exames = query.all()
    resultado = []
    for exame in exames:
        precos_list = [
            schemas.PrecoOut(
                plano_id=p.plano_id,
                plano_nome=p.plano.nome,
                preco=p.preco
            ) for p in exame.precos if p.ativo
        ]
        preco_min = min([p.preco for p in exame.precos if p.ativo], default=None)
        resultado.append(schemas.ExameOut(
            id=exame.id,
            nome=exame.nome,
            categoria_id=exame.categoria_id,
            descricao=exame.descricao,
            tempo_resultado=exame.tempo_resultado,
            preparo=exame.preparo,
            ativo=exame.ativo,
            categoria=exame.categoria,
            precos=precos_list,
            preco_minimo=preco_min
        ))
    return resultado

@router.get("/{exame_id}", response_model=schemas.ExameOut)
def buscar_exame(exame_id: int, db: Session = Depends(get_db)):
    exame = db.query(models.Exame).filter(
        models.Exame.id == exame_id,
        models.Exame.ativo == True
    ).first()
    if not exame:
        raise HTTPException(status_code=404, detail="Exame não encontrado")
    precos_list = [
        schemas.PrecoOut(plano_id=p.plano_id, plano_nome=p.plano.nome, preco=p.preco)
        for p in exame.precos if p.ativo
    ]
    preco_min = min([p.preco for p in exame.precos if p.ativo], default=None)
    return schemas.ExameOut(
        id=exame.id, nome=exame.nome, categoria_id=exame.categoria_id,
        descricao=exame.descricao, tempo_resultado=exame.tempo_resultado,
        preparo=exame.preparo, ativo=exame.ativo, categoria=exame.categoria,
        precos=precos_list, preco_minimo=preco_min
    )

@router.post("/", response_model=schemas.ExameOut, status_code=201)
def criar_exame(exame_in: schemas.ExameCreate, db: Session = Depends(get_db)):
    exame = models.Exame(**exame_in.model_dump())
    db.add(exame)
    db.commit()
    db.refresh(exame)
    return schemas.ExameOut(
        id=exame.id, nome=exame.nome, categoria_id=exame.categoria_id,
        descricao=exame.descricao, tempo_resultado=exame.tempo_resultado,
        preparo=exame.preparo, ativo=exame.ativo, categoria=exame.categoria,
        precos=[], preco_minimo=None
    )

@router.put("/{exame_id}", response_model=schemas.ExameOut)
def atualizar_exame(exame_id: int, exame_in: schemas.ExameUpdate, db: Session = Depends(get_db)):
    exame = db.query(models.Exame).filter(models.Exame.id == exame_id).first()
    if not exame:
        raise HTTPException(status_code=404, detail="Exame não encontrado")
    for campo, valor in exame_in.model_dump(exclude_unset=True).items():
        setattr(exame, campo, valor)
    db.commit()
    db.refresh(exame)
    precos_list = [
        schemas.PrecoOut(plano_id=p.plano_id, plano_nome=p.plano.nome, preco=p.preco)
        for p in exame.precos if p.ativo
    ]
    preco_min = min([p.preco for p in exame.precos if p.ativo], default=None)
    return schemas.ExameOut(
        id=exame.id, nome=exame.nome, categoria_id=exame.categoria_id,
        descricao=exame.descricao, tempo_resultado=exame.tempo_resultado,
        preparo=exame.preparo, ativo=exame.ativo, categoria=exame.categoria,
        precos=precos_list, preco_minimo=preco_min
    )

@router.delete("/{exame_id}", status_code=204)
def deletar_exame(exame_id: int, db: Session = Depends(get_db)):
    exame = db.query(models.Exame).filter(models.Exame.id == exame_id).first()
    if not exame:
        raise HTTPException(status_code=404, detail="Exame não encontrado")
    exame.ativo = False
    db.commit()