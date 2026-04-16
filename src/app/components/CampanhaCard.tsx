"use client";
import { Megaphone, Calendar, Users, Percent } from "lucide-react";
import type { Campanha } from "@/lib/mockData";

interface CampanhaCardProps {
  campanha: Campanha;
}

const statusColor: any = {
  ativa: { bg: "#dcfce7", color: "#16a34a", label: "Ativa" },
  pausada: { bg: "#fef9c3", color: "#ca8a04", label: "Pausada" },
  encerrada: { bg: "#fee2e2", color: "#dc2626", label: "Encerrada" },
};

export default function CampanhaCard({ campanha }: CampanhaCardProps) {
  const status = statusColor[campanha.status] || statusColor.ativa;

  return (
    <div style={{
      background: "var(--card)", borderRadius: "var(--radius-lg)",
      border: "1px solid var(--border)", padding: 24, boxShadow: "var(--shadow-sm)"
    }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 12 }}>
        <h3 style={{ fontSize: 16, fontWeight: 700, color: "var(--foreground)" }}>{campanha.nome}</h3>
        <span style={{
          background: status.bg,
          color: status.color,
          fontSize: 11, fontWeight: 600, padding: "3px 12px", borderRadius: 99
        }}>{status.label}</span>
      </div>

      <p style={{ fontSize: 13, color: "var(--muted)", marginBottom: 16, lineHeight: 1.5 }}>{campanha.descricao}</p>

      <div style={{ display: "flex", gap: 20, marginBottom: 16, flexWrap: "wrap" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
          <Percent size={14} color="var(--primary)" />
          <span style={{ fontWeight: 700, color: "var(--primary)" }}>{campanha.desconto_percentual}%</span>
          <span style={{ fontSize: 12, color: "var(--muted)" }}>off</span>
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
          <Users size={14} color="var(--muted)" />
          <span style={{ fontWeight: 600, color: "var(--foreground)" }}>{campanha.total_participantes}</span>
          <span style={{ fontSize: 12, color: "var(--muted)" }}>participantes</span>
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
          <Calendar size={14} color="var(--muted)" />
          <span style={{ fontSize: 12, color: "var(--muted)" }}>
            Até {new Date(campanha.data_fim).toLocaleDateString("pt-BR")}
          </span>
        </div>
      </div>

      {campanha.exames_incluidos?.length > 0 && (
        <div>
          <div style={{ fontSize: 12, color: "var(--muted)", marginBottom: 8, fontWeight: 500 }}>Exames incluídos:</div>
          <div style={{ display: "flex", flexWrap: "wrap", gap: 6 }}>
            {campanha.exames_incluidos.map((ex: string) => (
              <span key={ex} style={{
                background: "var(--muted-bg)", border: "1px solid var(--border)",
                borderRadius: 99, fontSize: 11, padding: "3px 10px", color: "var(--foreground)"
              }}>{ex}</span>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
