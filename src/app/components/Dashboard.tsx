"use client";
import { useEffect, useState } from "react";
import { DollarSign, Megaphone, Users, Shield, Activity, TrendingUp } from "lucide-react";

const API = "http://localhost:8000";

export default function Dashboard() {
  const [stats, setStats] = useState<any>(null);
  const [exames, setExames] = useState<any[]>([]);
  const [campanhas, setCampanhas] = useState<any[]>([]);

  useEffect(() => {
    fetch(`${API}/api/dashboard/`).then(r => r.json()).then(setStats);
    fetch(`${API}/api/dashboard/exames-recentes`).then(r => r.json()).then(setExames);
    fetch(`${API}/api/dashboard/campanhas-ativas`).then(r => r.json()).then(setCampanhas);
  }, []);

  const cards = [
    { label: "Exames Cadastrados", value: stats?.total_exames, sub: "Total de exames", icon: DollarSign, color: "#eff6ff", iconColor: "#3b82f6" },
    { label: "Campanhas Ativas", value: stats?.campanhas_ativas, sub: "Em andamento", icon: Megaphone, color: "#f0fdf4", iconColor: "#22c55e" },
    { label: "Pacientes", value: stats?.total_pacientes, sub: "Cadastrados", icon: Users, color: "#faf5ff", iconColor: "#a855f7" },
    { label: "Planos", value: stats?.total_planos, sub: "IRB, Plus, Essential, Elite", icon: Shield, color: "#eff6ff", iconColor: "#3b82f6" },
  ];

  return (
    <div>
      <div style={{ marginBottom: 28 }}>
        <h1 style={{ fontSize: 28, fontWeight: 700, color: "var(--text)" }}>Dashboard</h1>
        <p style={{ color: "var(--text-mid)", marginTop: 4 }}>Visão geral do sistema financeiro</p>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 16, marginBottom: 28 }}>
        {cards.map(({ label, value, sub, icon: Icon, color, iconColor }) => (
          <div key={label} style={{
            background: "var(--white)", borderRadius: "var(--radius)",
            border: "1px solid var(--border)", padding: "20px 24px",
            boxShadow: "var(--shadow)"
          }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
              <div>
                <div style={{ fontSize: 13, color: "var(--text-mid)", marginBottom: 8 }}>{label}</div>
                <div style={{ fontSize: 32, fontWeight: 700, color: "var(--text)" }}>{value ?? "..."}</div>
                <div style={{ fontSize: 12, color: "var(--text-light)", marginTop: 4 }}>{sub}</div>
              </div>
              <div style={{
                width: 44, height: 44, borderRadius: 12,
                background: color, display: "flex",
                alignItems: "center", justifyContent: "center"
              }}>
                <Icon size={22} color={iconColor} />
              </div>
            </div>
          </div>
        ))}
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
        <div style={{
          background: "var(--white)", borderRadius: "var(--radius)",
          border: "1px solid var(--border)", padding: 24, boxShadow: "var(--shadow)"
        }}>
          <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 20 }}>
            <Activity size={18} color="var(--blue)" />
            <h2 style={{ fontSize: 16, fontWeight: 600 }}>Exames Recentes</h2>
          </div>
          <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
            {exames.map((e: any) => (
              <div key={e.id} style={{
                display: "flex", justifyContent: "space-between",
                alignItems: "center", padding: "12px 0",
                borderBottom: "1px solid var(--border)"
              }}>
                <div>
                  <div style={{ fontWeight: 500, fontSize: 14 }}>{e.nome}</div>
                  <div style={{ fontSize: 12, color: "var(--text-mid)" }}>{e.categoria}</div>
                </div>
                <div style={{ color: "var(--blue)", fontWeight: 600 }}>
                  R$ {e.preco_minimo?.toFixed(2)}
                </div>
              </div>
            ))}
          </div>
        </div>

        <div style={{
          background: "var(--white)", borderRadius: "var(--radius)",
          border: "1px solid var(--border)", padding: 24, boxShadow: "var(--shadow)"
        }}>
          <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 20 }}>
            <TrendingUp size={18} color="var(--blue)" />
            <h2 style={{ fontSize: 16, fontWeight: 600 }}>Campanhas Ativas</h2>
          </div>
          <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
            {campanhas.map((c: any) => (
              <div key={c.id} style={{
                padding: 16, borderRadius: 10,
                border: "1px solid var(--border)", background: "var(--bg)"
              }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 6 }}>
                  <div style={{ fontWeight: 600, fontSize: 14 }}>{c.nome}</div>
                  <span style={{
                    background: "#dcfce7", color: "#16a34a",
                    fontSize: 11, fontWeight: 600, padding: "2px 10px", borderRadius: 99
                  }}>{c.desconto_percentual}% OFF</span>
                </div>
                <div style={{ fontSize: 12, color: "var(--text-mid)" }}>{c.descricao}</div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}