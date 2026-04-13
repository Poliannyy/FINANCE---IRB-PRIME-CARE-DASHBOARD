from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.routers import exames, planos, campanhas, pacientes, dashboard

app = FastAPI(
    title="IRB Prime Care Finance API",
    description="API do sistema financeiro da clínica IRB Prime Care",
    version="1.0.0"
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],
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