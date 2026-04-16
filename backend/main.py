import os
from dotenv import load_dotenv
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.routers import exames, planos, campanhas, pacientes, dashboard

load_dotenv()

app = FastAPI(
    title="IRB Prime Care Finance API",
    description="API do sistema financeiro da clínica IRB Prime Care",
    version=os.getenv("APP_VERSION", "1.0.0")
)

# Configuração de CORS via variável de ambiente
origins = os.getenv("CORS_ORIGINS", "http://localhost:3000").split(",")

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(dashboard.router, prefix="/api/dashboard", tags=["Dashboard"])
app.include_router(exames.router, prefix="/api/exames", tags=["Exames"])
app.include_router(planos.router, prefix="/api/planos", tags=["Planos"])
app.include_router(campanhas.router, prefix="/api/campanhas", tags=["Campanhas"])
app.include_router(pacientes.router, prefix="/api/pacientes", tags=["Pacientes"])

@app.get("/")
def root():
    return {"message": "IRB Prime Care Finance API v1.0.0"}