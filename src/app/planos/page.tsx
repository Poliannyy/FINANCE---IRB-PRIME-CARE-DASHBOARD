"use client";
import { useState, useEffect, useMemo } from "react";
import { Search, Shield, Star, Crown, Gem } from "lucide-react";
import { ExameAPI } from "@/lib/api";
import type { Exame } from "@/lib/mockData";

const plans = [
  { key: "preco_particular",      nome: "IRB Particular",   icon: Shield, description: "Atendimento particular sem plano",     color: "#2563eb", bg: "#eff6ff" },
  { key: "preco_prime_plus",      nome: "Prime Plus",       icon: Star,   description: "Plano básico com descontos",           color: "#d97706", bg: "#fffbeb" },
  { key: "preco_prime_essential", nome: "Prime Essential",  icon: Crown,  description: "Plano intermediário com mais benefícios", color: "#059669", bg: "#ecfdf5" },
  { key: "preco_prime_elite",     nome: "Prime Elite",      icon: Gem,    description: "Plano premium completo",               color: "#7c3aed", bg: "#faf5ff" },
];

export default function Planos() {
  const [exames, setExames] = useState<Exame[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [selectedPlan, setSelectedPlan] = useState<string | null>(null);

  useEffect(() => {
    ExameAPI.list().then(data => { setExames(data); setLoading(false); });
  }, []);

  const filtered = useMemo(() =>
    exames.filter(e => e.nome.toLowerCase().includes(search.toLowerCase())),
    [exames, search]
  );

  if (loading) {
    return (
      <div style={{ display: "flex", alignItems: "center", justifyContent: "center", height: 240 }}>
        <div style={{ width: 32, height: 32, border: "3px solid var(--border)", borderTopColor: "var(--primary)", borderRadius: "50%" }} className="animate-spin" />
      </div>
    );
  }

  return (
    <div style={{ maxWidth: 1100 }} className="animate-fade-in">
      <div style={{ marginBottom: 28 }}>
        <h1 style={{ fontSize: 28, fontWeight: 700, color: "var(--foreground)" }}>Planos da Clínica</h1>
        <p style={{ color: "var(--muted)", marginTop: 4 }}>Compare valores por plano</p>
      </div>

      {/* Plan cards */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: 14, marginBottom: 28 }}>
        {plans.map(plan => {
          const Icon = plan.icon;
          const active = selectedPlan === plan.key;
          return (
            <button
              key={plan.key}
              onClick={() => setSelectedPlan(active ? null : plan.key)}
              style={{
                padding: 20, borderRadius: "var(--radius-lg)",
                border: active ? `2px solid ${plan.color}` : "1px solid var(--border)",
                background: active ? plan.bg : "var(--card)",
                cursor: "pointer", textAlign: "left",
                boxShadow: active ? `0 0 0 4px ${plan.color}18` : "var(--shadow-sm)",
                transition: "all 0.2s ease",
                transform: active ? "scale(1.02)" : "scale(1)",
              }}
            >
              <Icon size={28} color={plan.color} style={{ marginBottom: 10 }} />
              <div style={{ fontWeight: 600, fontSize: 14, color: "var(--foreground)" }}>{plan.nome}</div>
              <div style={{ fontSize: 11, color: "var(--muted)", marginTop: 4 }}>{plan.description}</div>
            </button>
          );
        })}
      </div>

      {/* Search */}
      <div style={{ position: "relative", maxWidth: 380, marginBottom: 20 }}>
        <Search size={15} style={{ position: "absolute", left: 12, top: "50%", transform: "translateY(-50%)", color: "var(--muted)" }} />
        <input
          value={search}
          onChange={e => setSearch(e.target.value)}
          placeholder="Buscar exame..."
          style={{
            width: "100%", padding: "10px 12px 10px 36px",
            borderRadius: "var(--radius-sm)",
            border: "1px solid var(--border)",
            background: "var(--card)", fontSize: 14,
            color: "var(--foreground)", outline: "none",
          }}
        />
      </div>

      {/* Price table */}
      <div style={{
        background: "var(--card)",
        border: "1px solid var(--border)",
        borderRadius: "var(--radius-lg)",
        boxShadow: "var(--shadow-sm)",
        overflow: "hidden",
      }}>
        <div style={{ overflowX: "auto" }}>
          <table style={{ width: "100%", borderCollapse: "collapse" }}>
            <thead>
              <tr style={{ borderBottom: "1px solid var(--border)", background: "var(--muted-bg)" }}>
                <th style={{ textAlign: "left", padding: "14px 20px", fontSize: 13, fontWeight: 600, color: "var(--foreground)", minWidth: 200 }}>Exame</th>
                {plans.map(plan => (
                  <th key={plan.key} style={{
                    textAlign: "center", padding: "14px 16px",
                    fontSize: 13, fontWeight: 600,
                    color: selectedPlan === plan.key ? plan.color : "var(--foreground)",
                    background: selectedPlan === plan.key ? `${plan.color}0d` : "transparent",
                    transition: "all 0.15s",
                    minWidth: 130,
                  }}>{plan.nome}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {filtered.length === 0 ? (
                <tr><td colSpan={5} style={{ textAlign: "center", padding: 48, color: "var(--muted)" }}>Nenhum exame encontrado</td></tr>
              ) : filtered.map((exame, i) => (
                <tr key={exame.id} style={{
                  borderBottom: i < filtered.length - 1 ? "1px solid var(--border)" : "none",
                  transition: "background 0.1s",
                }}
                  onMouseEnter={e => (e.currentTarget as HTMLElement).style.background = "var(--muted-bg)"}
                  onMouseLeave={e => (e.currentTarget as HTMLElement).style.background = "transparent"}
                >
                  <td style={{ padding: "14px 20px" }}>
                    <div style={{ fontWeight: 500, fontSize: 13, color: "var(--foreground)" }}>{exame.nome}</div>
                    <div style={{ fontSize: 11, color: "var(--muted)", marginTop: 2 }}>{exame.categoria}</div>
                  </td>
                  {plans.map(plan => {
                    const price = exame[plan.key as keyof Exame] as number | null;
                    const isSelected = selectedPlan === plan.key;
                    return (
                      <td key={plan.key} style={{
                        textAlign: "center", padding: "14px 16px",
                        fontSize: 13, fontWeight: 600,
                        color: isSelected ? plan.color : "var(--foreground)",
                        background: isSelected ? `${plan.color}0d` : "transparent",
                        transition: "all 0.15s",
                      }}>
                        {price != null ? `R$ ${price.toFixed(2)}` : <span style={{ color: "var(--border)" }}>—</span>}
                      </td>
                    );
                  })}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
