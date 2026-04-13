"use client";
import { useEffect, useState } from "react";
import { Plus, Calendar, Users, Percent } from "lucide-react";

const API = "http://localhost:8000";

export default function Campanhas() {
  const [campanhas, setCampanhas] = useState<any[]>([]);
  const [filtro, setFiltro] = useState("ativa");

  useEffect(() => {
    const url = filtro === "todas"
      ? `${API}/api/campanhas/`
      : `${API}/api/campanhas/?status=${filtro}`;
    fetch(url).then(r => r.json()).then(setCampanhas);
  }, [filtro]);

  const abas = [
    { key: "ativa", label: "Ativas" },
    { key: "pausada", label: "Pausadas" },
    { key: "encerrada", label: "Encerradas" },
    { key: "todas", label: "Todas" },
  ];

  const statusColor: any = {
    ativa: { bg: "#dcfce7", color: "#16a34a", label: "Ativa" },
    pausada: { bg: "#fef9c3", color: "#ca8a04", label: "Pausada" },
    encerrada: { bg: "#fee2e2", color: "#dc2626", label: "Encerrada" },
  };

  return (
    <div>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 28 }}>
        <div>
          <h1 style={{ fontSize: 28, fontWeight: 700 }}>Campanhas</h1>
          <p style={{ color: "var(--text-mid)", marginTop: 4 }}>Gerencie promoções e descontos</p>
        </div>
        <button style={{
          display: "flex", alignItems: "center", gap: 8,
          background: "var(--blue)", color: "white", border: "none",
          borderRadius: 10, padding: "10px 20px", fontWeight: 600,
          fontSize: 14, cursor: "pointer"
        }}>
          <Plus size={16} /> Nova Campanha
        </button>
      </div>

      <div style={{ display: "flex", gap: 8, marginBottom: 24 }}>
        {abas.map(a => (
          <button key={a.key} onClick={() => setFiltro(a.key)} style={{
            padding: "8px 18px", borderRadius: 99, border: "1px solid var(--border)",
            background: filtro === a.key ? "var(--text)" : "var(--white)",
            color: filtro === a.key ? "white" : "var(--text-mid)",
            fontWeight: 500, fontSize: 13, cursor: "pointer"
          }}>{a.label}</button>
        ))}
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
        {campanhas.map((c: any) => (
          <div key={c.id} style={{
            background: "var(--white)", borderRadius: "var(--radius)",
            border: "1px solid var(--border)", padding: 24, boxShadow: "var(--shadow)"
          }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 12 }}>
              <h3 style={{ fontSize: 16, fontWeight: 700 }}>{c.nome}</h3>
              <span style={{
                background: statusColor[c.status]?.bg,
                color: statusColor[c.status]?.color,
                fontSize: 11, fontWeight: 600, padding: "3px 12px", borderRadius: 99
              }}>{statusColor[c.status]?.label}</span>
            </div>

            <p style={{ fontSize: 13, color: "var(--text-mid)", marginBottom: 16, lineHeight: 1.5 }}>{c.descricao}</p>

            <div style={{ display: "flex", gap: 20, marginBottom: 16 }}>
              <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
                <Percent size={14} color="var(--blue)" />
                <span style={{ fontWeight: 700, color: "var(--blue)" }}>{c.desconto_percentual}%</span>
                <span style={{ fontSize: 12, color: "var(--text-mid)" }}>off</span>
              </div>
              <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
                <Users size={14} color="var(--text-mid)" />
                <span style={{ fontWeight: 600 }}>{c.total_participantes}</span>
                <span style={{ fontSize: 12, color: "var(--text-mid)" }}>participantes</span>
              </div>
              <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
                <Calendar size={14} color="var(--text-mid)" />
                <span style={{ fontSize: 12, color: "var(--text-mid)" }}>
                  {new Date(c.data_fim).toLocaleDateString("pt-BR")}
                </span>
              </div>
            </div>

            {c.exames_incluidos?.length > 0 && (
              <div>
                <div style={{ fontSize: 12, color: "var(--text-mid)", marginBottom: 8 }}>Exames incluídos:</div>
                <div style={{ display: "flex", flexWrap: "wrap", gap: 6 }}>
                  {c.exames_incluidos.map((ex: string) => (
                    <span key={ex} style={{
                      background: "var(--bg)", border: "1px solid var(--border)",
                      borderRadius: 99, fontSize: 11, padding: "3px 10px", color: "var(--text)"
                    }}>{ex}</span>
                  ))}
                </div>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}