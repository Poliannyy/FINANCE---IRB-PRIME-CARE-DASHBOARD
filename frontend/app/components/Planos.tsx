"use client";
import { useEffect, useState } from "react";
import { Search, Shield, Star, Crown, Gem } from "lucide-react";

const API = "http://localhost:8000";

const icones: any = {
  "particular": Shield,
  "prime-plus": Star,
  "prime-essential": Crown,
  "prime-elite": Gem,
};

const cores: any = {
  "particular": { bg: "#f1f5f9", color: "#64748b" },
  "prime-plus": { bg: "#f0fdf4", color: "#16a34a" },
  "prime-essential": { bg: "#f0f9ff", color: "#0284c7" },
  "prime-elite": { bg: "#faf5ff", color: "#9333ea" },
};

export default function Planos() {
  const [tabela, setTabela] = useState<any>(null);
  const [busca, setBusca] = useState("");
  const [planoSelecionado, setPlanoSelecionado] = useState<string | null>(null);

  useEffect(() => {
    const url = busca
      ? `${API}/api/planos/tabela?busca=${busca}`
      : `${API}/api/planos/tabela`;
    fetch(url).then(r => r.json()).then(setTabela);
  }, [busca]);

  const planos = tabela?.planos ?? [];
  const linhas = tabela?.tabela ?? [];

  return (
    <div>
      <div style={{ marginBottom: 28 }}>
        <h1 style={{ fontSize: 28, fontWeight: 700 }}>Planos</h1>
        <p style={{ color: "var(--text-mid)", marginTop: 4 }}>Compare valores por plano</p>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 12, marginBottom: 24 }}>
        {planos.map((p: any) => {
          const Icon = icones[p.slug] ?? Shield;
          const cor = cores[p.slug] ?? cores["particular"];
          const selecionado = planoSelecionado === p.slug;
          return (
            <div
              key={p.id}
              onClick={() => setPlanoSelecionado(selecionado ? null : p.slug)}
              style={{
                background: selecionado ? cor.bg : "var(--white)",
                borderRadius: "var(--radius)",
                border: `2px solid ${selecionado ? cor.color : "var(--border)"}`,
                padding: "20px 16px", cursor: "pointer",
                transition: "all 0.15s", textAlign: "center"
              }}
            >
              <div style={{
                width: 40, height: 40, borderRadius: 10,
                background: cor.bg, display: "flex",
                alignItems: "center", justifyContent: "center",
                margin: "0 auto 12px"
              }}>
                <Icon size={20} color={cor.color} />
              </div>
              <div style={{ fontWeight: 700, fontSize: 14 }}>{p.nome}</div>
            </div>
          );
        })}
      </div>

      <div style={{
        background: "var(--white)", borderRadius: "var(--radius)",
        border: "1px solid var(--border)", boxShadow: "var(--shadow)", overflow: "hidden"
      }}>
        <div style={{ padding: "16px 24px", borderBottom: "1px solid var(--border)" }}>
          <div style={{
            display: "flex", alignItems: "center", gap: 10,
            background: "var(--bg)", border: "1px solid var(--border)",
            borderRadius: 10, padding: "10px 16px"
          }}>
            <Search size={16} color="var(--text-light)" />
            <input
              value={busca}
              onChange={e => setBusca(e.target.value)}
              placeholder="Buscar exame..."
              style={{
                border: "none", outline: "none", flex: 1,
                fontSize: 14, background: "transparent", color: "var(--text)"
              }}
            />
          </div>
        </div>

        <table style={{ width: "100%", borderCollapse: "collapse" }}>
          <thead>
            <tr style={{ background: "var(--bg)" }}>
              <th style={{ padding: "14px 24px", textAlign: "left", fontSize: 13, fontWeight: 600, color: "var(--text-mid)", borderBottom: "1px solid var(--border)" }}>
                Exame
              </th>
              {planos.map((p: any) => (
                <th key={p.id} style={{
                  padding: "14px 24px", textAlign: "right",
                  fontSize: 13, fontWeight: 600, color: "var(--text-mid)",
                  borderBottom: "1px solid var(--border)"
                }}>{p.nome}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {linhas
              .filter((l: any) => !planoSelecionado || l[planoSelecionado] !== undefined)
              .map((linha: any, i: number) => (
                <tr key={linha.exame_id} style={{ background: i % 2 === 0 ? "var(--white)" : "var(--bg)" }}>
                  <td style={{ padding: "14px 24px", borderBottom: "1px solid var(--border)" }}>
                    <div style={{ fontWeight: 500, fontSize: 14 }}>{linha.exame_nome}</div>
                    <div style={{ fontSize: 12, color: "var(--text-mid)" }}>{linha.categoria}</div>
                  </td>
                  {planos.map((p: any) => (
                    <td key={p.id} style={{
                      padding: "14px 24px", textAlign: "right",
                      fontSize: 14, fontWeight: 600,
                      color: planoSelecionado === p.slug ? cores[p.slug]?.color : "var(--text)",
                      borderBottom: "1px solid var(--border)"
                    }}>
                      {linha[p.slug] ? `R$ ${Number(linha[p.slug]).toFixed(2)}` : "-"}
                    </td>
                  ))}
                </tr>
              ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}