from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from app.database import get_db
from app import models, schemas

router = APIRouter()

@router.get("/", response_model=schemas.DashboardStats)
def dashboard_stats(db: Session = Depends(get_db)):
    total_exames = db.query(models.Exame).filter(models.Exame.ativo == True).count()
    campanhas_ativas = db.query(models.Campanha).filter(models.Campanha.status == "ativa").count()
    total_pacientes = db.query(models.Paciente).filter(models.Paciente.ativo == True).count()
    total_planos = db.query(models.Plano).filter(models.Plano.ativo == True).count()
    return schemas.DashboardStats(
        total_exames=total_exames,
        campanhas_ativas=campanhas_ativas,
        total_pacientes=total_pacientes,
        total_planos=total_planos
    )

@router.get("/exames-recentes")
def exames_recentes(db: Session = Depends(get_db)):
    exames = db.query(models.Exame).filter(models.Exame.ativo == True).limit(5).all()
    return [
        {
            "id": e.id,
            "nome": e.nome,
            "categoria": e.categoria.nome,
            "preco_minimo": float(min([p.preco for p in e.precos if p.ativo], default=0))
        }
        for e in exames
    ]

@router.get("/campanhas-ativas")
def campanhas_ativas(db: Session = Depends(get_db)):
    campanhas = db.query(models.Campanha).filter(models.Campanha.status == "ativa").limit(3).all()
    return [
        {
            "id": c.id,
            "nome": c.nome,
            "descricao": c.descricao,
            "desconto_percentual": float(c.desconto_percentual),
            "data_fim": str(c.data_fim),
            "total_participantes": len(c.pacientes)
        }
        for c in campanhas
    ]