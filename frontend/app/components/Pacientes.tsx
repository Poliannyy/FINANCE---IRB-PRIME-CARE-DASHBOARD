"use client";
import { useEffect, useState } from "react";
import { Search, Plus, Phone, Mail, Shield } from "lucide-react";

const API = "http://localhost:8000";

const etapas = [
  { key: "", label: "Todos" },
  { key: "primeiro_contato", label: "Primeiro Contato" },
  { key: "avaliacao", label: "Avaliação" },
  { key: "tratamento", label: "Tratamento" },
  { key: "acompanhamento", label: "Acompanhamento" },
  { key: "fidelizado", label: "Fidelizado" },
];

const etapaColor: any = {
  primeiro_contato: { bg: "#f1f5f9", color: "#64748b" },
  avaliacao: { bg: "#fef9c3", color: "#ca8a04" },
  tratamento: { bg: "#dbeafe", color: "#2563eb" },
  acompanhamento: { bg: "#f0fdf4", color: "#16a34a" },
  fidelizado: { bg: "#faf5ff", color: "#9333ea" },
};

const etapaLabel: any = {
  primeiro_contato: "Primeiro Contato",
  avaliacao: "Avaliação",
  tratamento: "Tratamento",
  acompanhamento: "Acompanhamento",
  fidelizado: "Fidelizado",
};

export default function Pacientes() {
  const [pacientes, setPacientes] = useState<any[]>([]);
  const [busca, setBusca] = useState("");
  const [etapa, setEtapa] = useState("");

  useEffect(() => {
    let url = `${API}/api/pacientes/?`;
    if (busca) url += `busca=${busca}&`;
    if (etapa) url += `etapa=${etapa}`;
    fetch(url).then(r => r.json()).then(setPacientes);
  }, [busca, etapa]);

  return (
    <div>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 28 }}>
        <div>
          <h1 style={{ fontSize: 28, fontWeight: 700 }}>Pacientes</h1>
          <p style={{ color: "var(--text-mid)", marginTop: 4 }}>Perfil e jornada dos pacientes</p>
        </div>
        <button style={{
          display: "flex", alignItems: "center", gap: 8,
          background: "var(--blue)", color: "white", border: "none",
          borderRadius: 10, padding: "10px 20px", fontWeight: 600,
          fontSize: 14, cursor: "pointer"
        }}>
          <Plus size={16} /> Novo Paciente
        </button>
      </div>

      <div style={{
        display: "flex", alignItems: "center", gap: 10,
        background: "var(--white)", border: "1px solid var(--border)",
        borderRadius: 10, padding: "10px 16px", marginBottom: 16
      }}>
        <Search size={16} color="var(--text-light)" />
        <input
          value={busca}
          onChange={e => setBusca(e.target.value)}
          placeholder="Buscar paciente..."
          style={{ border: "none", outline: "none", flex: 1, fontSize: 14, background: "transparent" }}
        />
      </div>

      <div style={{ display: "flex", gap: 8, marginBottom: 20 }}>
        {etapas.map(e => (
          <button key={e.key} onClick={() => setEtapa(e.key)} style={{
            padding: "7px 16px", borderRadius: 99,
            border: "1px solid var(--border)",
            background: etapa === e.key ? "var(--text)" : "var(--white)",
            color: etapa === e.key ? "white" : "var(--text-mid)",
            fontWeight: 500, fontSize: 12, cursor: "pointer"
          }}>{e.label}</button>
        ))}
      </div>

      <div style={{ fontSize: 13, color: "var(--text-mid)", marginBottom: 16 }}>
        {pacientes.length} pacientes
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
        {pacientes.map((p: any) => (
          <div key={p.id} style={{
            background: "var(--white)", borderRadius: "var(--radius)",
            border: "1px solid var(--border)", padding: 24, boxShadow: "var(--shadow)"
          }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 16 }}>
              <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                <div style={{
                  width: 44, height: 44, borderRadius: "50%",
                  background: "var(--blue-light)", display: "flex",
                  alignItems: "center", justifyContent: "center"
                }}>
                  <Shield size={20} color="var(--blue)" />
                </div>
                <div>
                  <div style={{ fontWeight: 700, fontSize: 15 }}>{p.nome}</div>
                  <div style={{ fontSize: 12, color: "var(--text-mid)" }}>{p.idade} anos</div>
                </div>
              </div>
              <span style={{
                background: etapaColor[p.etapa_jornada]?.bg,
                color: etapaColor[p.etapa_jornada]?.color,
                fontSize: 11, fontWeight: 600, padding: "3px 12px", borderRadius: 99
              }}>{etapaLabel[p.etapa_jornada]}</span>
            </div>

            <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
              {p.plano && (
                <div style={{ display: "flex", alignItems: "center", gap: 8, fontSize: 13, color: "var(--text-mid)" }}>
                  <Shield size={14} />
                  <span>{p.plano.nome}</span>
                </div>
              )}
              {p.telefone && (
                <div style={{ display: "flex", alignItems: "center", gap: 8, fontSize: 13, color: "var(--text-mid)" }}>
                  <Phone size={14} />
                  <span>{p.telefone}</span>
                </div>
              )}
              {p.email && (
                <div style={{ display: "flex", alignItems: "center", gap: 8, fontSize: 13, color: "var(--text-mid)" }}>
                  <Mail size={14} />
                  <span>{p.email}</span>
                </div>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}