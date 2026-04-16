"use client";
import { Shield, Phone, Mail, User } from "lucide-react";
import type { Paciente } from "@/lib/mockData";

interface PacienteCardProps {
  paciente: Paciente;
}

const etapaColor: any = {
  primeiro_contato: { bg: "#f1f5f9", color: "#64748b", label: "Primeiro Contato" },
  avaliacao: { bg: "#fef9c3", color: "#ca8a04", label: "Avaliação" },
  tratamento: { bg: "#dbeafe", color: "#2563eb", label: "Tratamento" },
  acompanhamento: { bg: "#f0fdf4", color: "#16a34a", label: "Acompanhamento" },
  fidelizado: { bg: "#faf5ff", color: "#9333ea", label: "Fidelizado" },
};

export default function PacienteCard({ paciente }: PacienteCardProps) {
  const etapa = etapaColor[paciente.etapa_jornada] || etapaColor.primeiro_contato;

  return (
    <div style={{
      background: "var(--card)", borderRadius: "var(--radius-lg)",
      border: "1px solid var(--border)", padding: 24, boxShadow: "var(--shadow-sm)"
    }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 16 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
          <div style={{
            width: 44, height: 44, borderRadius: "50%",
            background: "var(--primary-light)", display: "flex",
            alignItems: "center", justifyContent: "center"
          }}>
            <User size={20} color="var(--primary)" />
          </div>
          <div>
            <div style={{ fontWeight: 700, fontSize: 15, color: "var(--foreground)" }}>{paciente.nome}</div>
            <div style={{ fontSize: 12, color: "var(--muted)" }}>{paciente.idade} anos</div>
          </div>
        </div>
        <span style={{
          background: etapa.bg,
          color: etapa.color,
          fontSize: 11, fontWeight: 600, padding: "3px 12px", borderRadius: 99
        }}>{etapa.label}</span>
      </div>

      <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 8, fontSize: 13, color: "var(--muted)" }}>
          <Shield size={14} />
          <span>Plano: {paciente.plano_id ? `ID ${paciente.plano_id}` : "Particular"}</span>
        </div>
        {paciente.telefone && (
          <div style={{ display: "flex", alignItems: "center", gap: 8, fontSize: 13, color: "var(--muted)" }}>
            <Phone size={14} />
            <span>{paciente.telefone}</span>
          </div>
        )}
        {paciente.email && (
          <div style={{ display: "flex", alignItems: "center", gap: 8, fontSize: 13, color: "var(--muted)" }}>
            <Mail size={14} />
            <span>{paciente.email}</span>
          </div>
        )}
      </div>
      {paciente.observacoes && (
        <div style={{ marginTop: 12, paddingTop: 12, borderTop: "1px solid var(--border)", fontSize: 12, color: "var(--muted)", fontStyle: "italic" }}>
          {paciente.observacoes}
        </div>
      )}
    </div>
  );
}
